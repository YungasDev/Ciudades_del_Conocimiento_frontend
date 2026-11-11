import { Component, input } from '@angular/core';
import { Actor } from '../../core/models/api.models';

@Component({
  selector: 'app-actor-card',
  templateUrl: './actor-card.html',
})
export class ActorCard {
  readonly actor = input.required<Actor>();

  sectorLabel(): string {
    const labels: Record<string, string> = {
      GOBIERNO: 'Gobierno municipal',
      EDUCACION: 'Educación',
      SECTOR_PRIVADO: 'Sector privado',
      COMUNIDAD: 'Comunidad',
    };
    return labels[this.actor().sector] ?? this.actor().sector;
  }

  initials(): string {
    const stopWords = new Set(['de', 'del', 'la', 'las', 'los', 'el', 'y']);
    const words = this.actor()
      .name.split(/\s+/)
      .filter((part) => part && !stopWords.has(part.toLowerCase()));

    return words
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase();
  }
}
