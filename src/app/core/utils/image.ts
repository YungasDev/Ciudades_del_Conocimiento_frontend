/**
 * Optimiza una imagen en el navegador antes de subirla:
 * - la redimensiona a un ancho máximo
 * - la convierte a WebP
 *
 * Si el navegador no puede generar WebP, devuelve el archivo original
 * para no romper la subida.
 */
export async function optimizeToWebp(
  file: File,
  maxWidth: number,
  quality = 0.85,
): Promise<File> {
  if (!file.type.startsWith('image/')) return file;

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl);
    const scale = Math.min(1, maxWidth / image.naturalWidth);
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) return file;

    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/webp', quality);
    });

    if (!blob || blob.type !== 'image/webp') return file;

    const filename = `${file.name.replace(/\.[^.]+$/, '') || 'imagen'}.webp`;
    return new File([blob], filename, {
      type: 'image/webp',
      lastModified: Date.now(),
    });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('No se pudo leer la imagen'));
    image.src = source;
  });
}
