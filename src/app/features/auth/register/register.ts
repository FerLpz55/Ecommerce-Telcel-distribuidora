import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register {
  private auth = inject(AuthService);
  private router = inject(Router);

  nombre = '';
  apellido_paterno = '';
  apellido_materno = '';
  correo = '';
  contrasena = '';
  confirmar_contrasena = '';
  error = signal('');
  loading = signal(false);

  get passwordMismatch(): boolean {
    return this.contrasena !== this.confirmar_contrasena && this.confirmar_contrasena.length > 0;
  }

  onSubmit(): void {
    if (this.passwordMismatch) return;
    this.error.set('');
    this.loading.set(true);
    this.auth.register({
      nombre: this.nombre,
      apellido_paterno: this.apellido_paterno,
      apellido_materno: this.apellido_materno,
      correo: this.correo,
      contrasena: this.contrasena,
      confirmar_contrasena: this.confirmar_contrasena
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Error al registrarse');
      }
    });
  }
}
