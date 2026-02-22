import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword {
  private auth = inject(AuthService);
  private router = inject(Router);

  nueva_contrasena = '';
  confirmar_contrasena = '';
  loading = signal(false);
  error = signal('');

  get passwordMismatch(): boolean {
    return (
      this.nueva_contrasena !== this.confirmar_contrasena &&
      this.confirmar_contrasena.length > 0
    );
  }

  onSubmit(): void {
    if (this.passwordMismatch) return;

    this.error.set('');
    this.loading.set(true);
    this.auth.updateRecoveredPassword(this.nueva_contrasena, this.confirmar_contrasena).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/login'], { queryParams: { reset: 'ok' } });
      },
      error: (err: { error?: { message?: string } }) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'No se pudo restablecer la contraseña.');
      },
    });
  }
}
