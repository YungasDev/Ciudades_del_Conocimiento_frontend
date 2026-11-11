import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },
  {
    path: 'programa',
    loadComponent: () =>
      import('./features/program/program').then((m) => m.Program),
  },
  {
    path: 'mesa-de-enlace',
    loadComponent: () => import('./features/mesa/mesa').then((m) => m.Mesa),
  },
  {
    path: 'instituciones',
    loadComponent: () =>
      import('./features/actors/actors-page').then((m) => m.ActorsPage),
  },
  {
    path: 'novedades',
    loadComponent: () =>
      import('./features/news/news-list').then((m) => m.NewsList),
  },
  {
    path: 'novedades/:slug',
    loadComponent: () =>
      import('./features/news/news-detail').then((m) => m.NewsDetail),
  },
  {
    path: 'agenda',
    loadComponent: () =>
      import('./features/agenda/agenda').then((m) => m.Agenda),
  },
  {
    path: 'contacto',
    loadComponent: () =>
      import('./features/contact/contact').then((m) => m.Contact),
  },
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./features/admin/login/login').then((m) => m.Login),
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/admin/admin-layout/admin-layout').then(
        (m) => m.AdminLayout,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard').then(
            (m) => m.Dashboard,
          ),
      },
      {
        path: 'novedades',
        loadComponent: () =>
          import('./features/admin/posts/posts').then((m) => m.AdminPosts),
      },
      {
        path: 'novedades/nueva',
        loadComponent: () =>
          import('./features/admin/posts/post-form').then((m) => m.PostForm),
      },
      {
        path: 'novedades/:id',
        loadComponent: () =>
          import('./features/admin/posts/post-form').then((m) => m.PostForm),
      },
      {
        path: 'instituciones',
        loadComponent: () =>
          import('./features/admin/actors/actors').then((m) => m.AdminActors),
      },
      {
        path: 'categorias',
        loadComponent: () =>
          import('./features/admin/categories/categories').then(
            (m) => m.AdminCategories,
          ),
      },
      {
        path: 'eventos',
        loadComponent: () =>
          import('./features/admin/events/events').then((m) => m.AdminEvents),
      },
      {
        path: 'mensajes',
        loadComponent: () =>
          import('./features/admin/messages/messages').then(
            (m) => m.AdminMessages,
          ),
      },
    ],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found').then((m) => m.NotFound),
  },
];
