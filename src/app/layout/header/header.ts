import { Component, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

type Dropdown = 'programa' | 'mesa' | null;

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.html',
})
export class Header {
  readonly scrolled = signal(false);
  readonly menuOpen = signal(false);
  readonly dropdown = signal<Dropdown>(null);

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 12);
  }

  @HostListener('document:click')
  closeAll(): void {
    this.dropdown.set(null);
    this.menuOpen.set(false);
  }

  toggleDropdown(name: Exclude<Dropdown, null>, event: Event): void {
    event.stopPropagation();
    this.dropdown.update((current) => (current === name ? null : name));
  }

  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.menuOpen.update((open) => !open);
  }

  close(): void {
    this.menuOpen.set(false);
    this.dropdown.set(null);
  }
}
