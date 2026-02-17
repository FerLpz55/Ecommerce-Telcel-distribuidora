import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
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

  login(credentials: LoginRequest): void {
    this.loading.set(true);
    this.api.post<AuthResponse>('login.php', credentials).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.user) {
          this.currentUser.set(res.user);
          this.permissions.set(res.permisos ?? []);
          this.router.navigate([res.redirect ?? '/home']);
        }
      },
      error: () => this.loading.set(false)
    });
  }

  register(data: RegisterRequest): void {
    this.loading.set(true);
    this.api.post<AuthResponse>('register.php', data).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.success && res.user) {
          this.currentUser.set(res.user);
          this.permissions.set(res.permisos ?? []);
          this.router.navigate(['/home']);
        }
      },
      error: () => this.loading.set(false)
    });
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
