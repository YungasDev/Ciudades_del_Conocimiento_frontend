export function formatDate(value: string | Date | null): string {
  if (!value) return '';
  const date = new Date(value);
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatShortDate(value: string | Date | null): string {
  if (!value) return '';
  const date = new Date(value);
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export function formatTime(value: string | Date | null): string {
  if (!value) return '';
  const date = new Date(value);
  return new Intl.DateTimeFormat('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

export function monthDay(value: string | Date | null): {
  day: string;
  month: string;
} {
  if (!value) return { day: '', month: '' };
  const date = new Date(value);
  return {
    day: new Intl.DateTimeFormat('es-AR', { day: '2-digit' }).format(date),
    month: new Intl.DateTimeFormat('es-AR', { month: 'short' })
      .format(date)
      .replace('.', ''),
  };
}
