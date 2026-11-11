import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { Footer } from './layout/footer/footer';
import { Header } from './layout/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
})
export class App {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  readonly isAdmin = signal(this.router.url.startsWith('/admin'));

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isAdmin.set(this.router.url.startsWith('/admin'));
      });

    if (this.auth.hasToken()) {
      this.auth.loadProfile().subscribe({
        error: () => this.auth.clearSession(),
      });
    }
  }
}
