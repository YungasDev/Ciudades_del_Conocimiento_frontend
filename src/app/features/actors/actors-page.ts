import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Actor, ActorSector } from '../../core/models/api.models';
import { ContentService } from '../../core/services/content.service';
import { ActorCard } from '../../shared/actor-card/actor-card';

@Component({
  selector: 'app-actors-page',
  imports: [RouterLink, ActorCard],
  templateUrl: './actors-page.html',
})
export class ActorsPage implements OnInit {
  private readonly content = inject(ContentService);

  readonly actors = signal<Actor[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly sector = signal<ActorSector | 'TODOS'>('TODOS');

  readonly sectors: { value: ActorSector; label: string }[] = [
    { value: 'GOBIERNO', label: 'Gobierno' },
    { value: 'EDUCACION', label: 'Educación' },
    { value: 'SECTOR_PRIVADO', label: 'Sector privado' },
    { value: 'COMUNIDAD', label: 'Comunidad' },
  ];

  readonly filtered = computed(() => {
    const selected = this.sector();
    return selected === 'TODOS'
      ? this.actors()
      : this.actors().filter((actor) => actor.sector === selected);
  });

  ngOnInit(): void {
    this.content.getActors().subscribe({
      next: (actors) => {
        this.actors.set(actors);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }

  selectSector(value: ActorSector | 'TODOS'): void {
    this.sector.set(value);
  }
}
