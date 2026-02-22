import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  correo = '';
  contrasena = '';
  error = signal('');
  success = signal('');
  loading = signal(false);

  constructor() {
    if (this.route.snapshot.queryParamMap.get('reset') === 'ok') {
      this.success.set('Contraseña restablecida. Inicia sesión con tu nueva contraseña.');
    }
  }

  onSubmit(): void {
    this.error.set('');
    this.success.set('');
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
