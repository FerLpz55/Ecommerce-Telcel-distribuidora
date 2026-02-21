import { Injectable, signal, computed, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, from, map, throwError } from 'rxjs';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { SupabaseAuthService } from './supabase-auth.service';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<User | null>(null);
  private permissions = signal<string[]>([]);
  private loading = signal(false);

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUser());
  readonly isAdmin = computed(() => {
    const u = this.currentUser();
    return u?.rol === 'admin' || u?.rol === 'super_admin';
  });
  readonly isLoading = this.loading.asReadonly();

  constructor(
    private supabaseAuth: SupabaseAuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.checkSession();
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    this.loading.set(true);
    return from(
      this.supabaseAuth.login({
        email: credentials.correo,
        password: credentials.contrasena,
      }),
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw this.createUiError(error.message || 'Credenciales inválidas');
        }

        if (!data.user) {
          throw this.createUiError('No se recibió información de usuario.');
        }

        const user = this.mapSupabaseUser(data.user);
        this.currentUser.set(user);
        this.permissions.set([]);

        return {
          success: true,
          message: 'Inicio de sesión exitoso',
          user,
          permisos: [],
        };
      }),
      catchError((err: unknown) =>
        throwError(() => this.normalizeAuthError(err, 'Error al iniciar sesión')),
      ),
      finalize(() => this.loading.set(false)),
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    this.loading.set(true);
    return from(
      this.supabaseAuth.signUp({
        email: data.correo,
        password: data.contrasena,
        options: {
          data: {
            nombre: data.nombre,
            apellido_paterno: data.apellido_paterno,
            apellido_materno: data.apellido_materno,
            rol: 'cliente',
          },
        },
      }),
    ).pipe(
      map(({ data: signUpData, error }) => {
        if (error) {
          throw this.createUiError(error.message || 'No se pudo completar el registro.');
        }

        const user = signUpData.user ? this.mapSupabaseUser(signUpData.user) : undefined;
        if (user) {
          this.currentUser.set(user);
          this.permissions.set([]);
        }

        return {
          success: true,
          message: signUpData.session
            ? 'Registro exitoso'
            : 'Registro exitoso. Revisa tu correo para confirmar tu cuenta.',
          user,
          permisos: [],
        };
      }),
      catchError((err: unknown) =>
        throwError(() => this.normalizeAuthError(err, 'Error al registrarse')),
      ),
      finalize(() => this.loading.set(false)),
    );
  }

  logout(): void {
    this.currentUser.set(null);
    this.permissions.set([]);
    void this.supabaseAuth.logout().finally(() => {
      this.router.navigate(['/login']);
    });
  }

  checkSession(): void {
    this.supabaseAuth.session$.subscribe({
      next: (session) => {
        if (!session?.user) {
          this.currentUser.set(null);
          this.permissions.set([]);
          return;
        }
        this.currentUser.set(this.mapSupabaseUser(session.user));
        this.permissions.set([]);
      },
    });
  }

  hasPermission(permiso: string): boolean {
    return this.permissions().includes(permiso);
  }

  private mapSupabaseUser(supabaseUser: SupabaseUser): User {
    const metadata = (supabaseUser.user_metadata ?? {}) as Record<string, unknown>;
    return {
      id_u: this.numberFromMeta(metadata['id_u']),
      nombre: this.stringFromMeta(metadata['nombre']),
      apellido_paterno: this.stringFromMeta(metadata['apellido_paterno']),
      apellido_materno: this.stringFromMeta(metadata['apellido_materno']),
      correo: supabaseUser.email ?? '',
      rol: this.roleFromMeta(metadata['rol']),
      email_verified: Boolean(supabaseUser.email_confirmed_at),
      ultimo_acceso: supabaseUser.last_sign_in_at ?? undefined,
    };
  }

  private normalizeAuthError(err: unknown, fallbackMessage: string): { error: { message: string } } {
    if (this.isUiError(err)) {
      return err;
    }
    if (err instanceof Error && err.message) {
      return this.createUiError(err.message);
    }
    return this.createUiError(fallbackMessage);
  }

  private createUiError(message: string): { error: { message: string } } {
    return { error: { message } };
  }

  private isUiError(value: unknown): value is { error: { message: string } } {
    if (!value || typeof value !== 'object') return false;
    const candidate = value as { error?: { message?: unknown } };
    return typeof candidate.error?.message === 'string';
  }

  private stringFromMeta(value: unknown): string {
    return typeof value === 'string' ? value : '';
  }

  private numberFromMeta(value: unknown): number {
    return typeof value === 'number' && Number.isFinite(value) ? value : 0;
  }

  private roleFromMeta(value: unknown): User['rol'] {
    if (
      value === 'admin' ||
      value === 'super_admin' ||
      value === 'empleado' ||
      value === 'cliente'
    ) {
      return value;
    }
    return 'cliente';
  }
}
