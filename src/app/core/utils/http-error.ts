import { HttpErrorResponse } from '@angular/common/http';

/**
 * Extrae un mensaje legible de una respuesta de error del backend.
 * NestJS devuelve `message` como texto o como arreglo de validaciones.
 */
export function getHttpErrorMessage(error: HttpErrorResponse): string {
  const body: unknown = error.error;

  if (typeof body === 'object' && body !== null && 'message' in body) {
    const message = (body as { message: unknown }).message;

    if (Array.isArray(message)) {
      return message.join('. ');
    }

    if (typeof message === 'string') {
      return message;
    }
  }

  if (error.status === 0) {
    return 'No se pudo conectar con el servidor. Verificá que el backend esté iniciado.';
  }

  return 'Ocurrió un error inesperado. Intentá nuevamente.';
}
