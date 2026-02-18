import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);

  correo = '';
  contrasena = '';
  error = signal('');
  loading = signal(false);

  onSubmit(): void {
    this.error.set('');
    this.loading.set(true);
    this.auth.login({ correo: this.correo, contrasena: this.contrasena }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error al iniciar sesión');
      }
    });
  }
}
