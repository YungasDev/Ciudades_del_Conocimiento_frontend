# Ciudades del Conocimiento — Frontend

Sitio público y panel de administración del programa **Ciudades del Conocimiento** de la Municipalidad de Libertador General San Martín (Jujuy).

Aplicación Angular 20 con Bootstrap y SCSS. Consume la API NestJS del programa.

## Requisitos

- Node.js 20 o superior.
- npm.
- La API del programa corriendo en `http://localhost:3000` (repositorio del backend).

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm start
```

El sitio queda en <http://localhost:4200>.

El servidor de desarrollo usa `proxy.conf.json` para redirigir `/api` y `/uploads` a `http://localhost:3000`.

## Build de producción

```bash
npm run build
```

El resultado queda en `dist/frontend/browser`.

## Rutas principales

| Ruta | Descripción |
|---|---|
| `/` | Home |
| `/programa` | El programa |
| `/mesa-de-enlace` | Mesa de Enlace |
| `/instituciones` | Instituciones y actores |
| `/novedades` | Listado de novedades |
| `/novedades/:slug` | Detalle de novedad |
| `/agenda` | Agenda |
| `/contacto` | Contacto |
| `/admin/login` | Acceso al panel |
| `/admin` | Dashboard del panel |

## Panel

El panel requiere autenticación contra la API. Permite administrar:

- Novedades y portadas.
- Categorías.
- Instituciones y actores, con consentimiento y logo.
- Eventos.
- Mensajes de contacto.

## Estructura

```
src/app/
  core/        Modelos, servicios, guard, interceptor y utilidades
  features/    Home, programa, mesa, instituciones, novedades,
               agenda, contacto, admin y 404
  layout/      Header y footer
  shared/      Tarjetas de novedades e instituciones
```

## Configuración de la API

La URL se define en:

- `src/environments/environment.development.ts` → `/api` (con proxy local).
- `src/environments/environment.ts` → `/api` (producción, mismo dominio).

En producción, Nginx debe redirigir `/api` y `/uploads` a la API.

## Docker

El frontend incluye `Dockerfile` y `nginx.conf` para servirse con Nginx. El `docker-compose.yml` completo está en el repositorio del proyecto general.

## Notas

- No subir `node_modules`, `dist` ni `.angular` al repositorio; ya están en `.gitignore`.
- Las imágenes de ejemplo están en `public/assets/images/`.
- Para cambiar textos institucionales, editar los componentes de `features/`.

## Vista previa

![Home](docs/home.png)
