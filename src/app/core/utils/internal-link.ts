export interface InternalLink {
  commands: string[];
  queryParams: Record<string, string>;
}

/**
 * Convierte una URL interna como "/contacto?motivo=mesa-de-enlace" en
 * comandos + query params para RouterLink. Si se pasa la URL completa como
 * string, Angular la codifica y termina navegando a una ruta inexistente.
 */
export function toInternalLink(
  value: string | null | undefined,
  fallback: string,
): InternalLink {
  const raw = (value ?? '').trim() || fallback;

  try {
    const url = new URL(raw, 'http://local.invalid');
    const queryParams: Record<string, string> = {};
    url.searchParams.forEach((queryValue, key) => {
      queryParams[key] = queryValue;
    });

    return {
      commands: [url.pathname || fallback],
      queryParams,
    };
  } catch {
    return { commands: [fallback], queryParams: {} };
  }
}
