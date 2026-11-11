import { HttpInterceptorFn } from '@angular/common/http';
import { TOKEN_STORAGE_KEY } from '../constants/auth.constants';

/**
 * Adjunta el token JWT a todas las solicitudes salientes.
 */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);

  if (!token) {
    return next(request);
  }

  return next(
    request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
