import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  private auth = inject(AuthService);

  correo = '';
  loading = signal(false);
  error = signal('');
  success = signal('');

  sendCode(): void {
    this.error.set('');
    this.success.set('');
    this.loading.set(true);

    this.auth.requestPasswordResetCode(this.correo).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.success.set(response.message);
      },
      error: (err: { error?: { message?: string } }) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'No se pudo enviar el correo de recuperación.');
      },
    });
  }
}
