const fs = require('node:fs');
const path = require('node:path');

const raw = (process.env.RENDER_API_URL || '').trim().replace(/\/+$/, '');
const isNetlify = process.env.NETLIFY === 'true';

if (!raw && isNetlify) {
  console.error('');
  console.error('Falta la variable RENDER_API_URL en Netlify.');
  console.error('Configurala con la URL pública de Render, por ejemplo:');
  console.error('  RENDER_API_URL=https://ciudades-conocimiento-api.onrender.com');
  console.error('');
  process.exit(1);
}

const target = raw || 'https://TU-BACKEND.onrender.com';

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
