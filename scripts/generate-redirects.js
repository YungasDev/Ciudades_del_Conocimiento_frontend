const fs = require('node:fs');
const path = require('node:path');

const DEFAULT_RENDER_URL =
  'https://ciudades-del-conocimiento-backend.onrender.com';

const raw = (process.env.RENDER_API_URL || '').trim().replace(/\/+$/, '');

if (!raw) {
  console.warn(
    `RENDER_API_URL no está definida; se usa ${DEFAULT_RENDER_URL}`,
  );
}

const target = raw || DEFAULT_RENDER_URL;

const redirects = [
  `/api/*  ${target}/api/:splat  200!`,
  `/uploads/*  ${target}/uploads/:splat  200!`,
  '/*  /index.html  200',
  '',
].join('\n');

const output = path.join(__dirname, '..', 'public', '_redirects');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, redirects, 'utf8');

console.log(`_redirects generado con destino: ${target}`);
