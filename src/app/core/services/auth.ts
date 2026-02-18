import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of } from 'rxjs';
import { ApiService } from './api';
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

  constructor(private api: ApiService, private router: Router) {
    this.checkSession();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    this.loading.set(true);
    return this.api.post<AuthResponse>('login.php', credentials).pipe(
      tap((res) => {
        this.loading.set(false);
        if (res.success && res.user) {
          this.currentUser.set(res.user);
          this.permissions.set(res.permisos ?? []);
        }
      }),
      catchError((err) => {
        this.loading.set(false);
        throw err;
      })
    );
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    this.loading.set(true);
    return this.api.post<AuthResponse>('register.php', data).pipe(
      tap((res) => {
        this.loading.set(false);
        if (res.success && res.user) {
          this.currentUser.set(res.user);
          this.permissions.set(res.permisos ?? []);
        }
      }),
      catchError((err) => {
        this.loading.set(false);
        throw err;
      })
    );
  }

  logout(): void {
    this.api.post<{ success: boolean }>('logout.php', {}).subscribe({
      next: () => {
        this.currentUser.set(null);
        this.permissions.set([]);
        this.router.navigate(['/login']);
      }
    });
  }

  checkSession(): void {
    this.api.get<{ logged_in: boolean; user?: User; permisos?: string[] }>('check-session.php').subscribe({
      next: (res) => {
        if (res.logged_in && res.user) {
          this.currentUser.set(res.user);
          this.permissions.set(res.permisos ?? []);
        }
      }
    });
  }

  hasPermission(permiso: string): boolean {
    return this.permissions().includes(permiso);
  }
}
