import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Permite el acceso solo si hay una sesión guardada.
 * Si el token está vencido, el backend responderá 401 y la pantalla
 * mostrará el error correspondiente.
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.hasToken() ? true : router.createUrlTree(['/login']);
};
