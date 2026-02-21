import { Injectable, signal, computed, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, catchError, finalize, from, map, throwError } from 'rxjs';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { SupabaseAuthService } from './supabase-auth.service';
import { SupabaseService } from './supabase.service';
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
    private supabaseService: SupabaseService,
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
    return from(this.registerWithProfile(data)).pipe(
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

  private async registerWithProfile(data: RegisterRequest): Promise<AuthResponse> {
    const correo = data.correo.trim().toLowerCase();
    const contrasena = data.contrasena.trim();

    if (!correo) {
      throw this.createUiError('El correo es obligatorio.');
    }

    if (contrasena.length < 6) {
      throw this.createUiError('La contraseña debe tener al menos 6 caracteres.');
    }

    if (contrasena !== data.confirmar_contrasena) {
      throw this.createUiError('Las contraseñas no coinciden.');
    }

    const { data: signUpData, error } = await this.supabaseAuth.signUp({
      email: correo,
      password: contrasena,
      options: {
        data: {
          nombre: data.nombre,
          apellido_paterno: data.apellido_paterno,
          apellido_materno: data.apellido_materno,
          rol: 'cliente',
        },
      },
    });

    if (error) {
      throw this.createUiError(this.mapSupabaseRegisterError(error.message));
    }

    if (signUpData.user) {
      const supabase = this.supabaseService.getClient();
      const fullName = `${data.nombre} ${data.apellido_paterno} ${data.apellido_materno}`.replace(/\s+/g, ' ').trim();

      const { error: profileError } = await supabase.from('profiles').upsert(
        {
          id: signUpData.user.id,
          full_name: fullName,
          address: null,
          phone: null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' },
      );

      if (profileError) {
        throw this.createUiError(`Usuario creado, pero no se pudo guardar profile: ${profileError.message}`);
      }
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

  private mapSupabaseRegisterError(message?: string): string {
    const raw = (message || '').toLowerCase();
    if (raw.includes('user already registered')) {
      return 'Ese correo ya está registrado. Inicia sesión o recupera tu contraseña.';
    }
    if (raw.includes('password') && raw.includes('at least')) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (raw.includes('unable to validate email address') || raw.includes('invalid email')) {
      return 'El correo electrónico no es válido.';
    }
    if (raw.includes('signup') && raw.includes('disabled')) {
      return 'El registro está deshabilitado en Supabase (Auth > Providers > Email).';
    }
    if (raw.includes('captcha')) {
      return 'El registro requiere captcha. Desactívalo o configura captcha en Supabase.';
    }
    return message || 'No se pudo completar el registro.';
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
