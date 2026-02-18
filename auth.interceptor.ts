import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { from, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Convierte la promesa del token en un observable
  return from(authService.getToken()).pipe(
    switchMap(token => {
      // Si la URL no es de la API de Supabase, no añadas el token
      if (!req.url.includes('supabase.co')) {
        return next(req);
      }

      // Si hay un token, clona la petición y añade las cabeceras
      if (token) {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next(authReq);
      }
      // Si no hay token, deja pasar la petición original
      return next(req);
    })
  );
};