import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';
import { EventItem, PostSummary } from '../../core/models/api.models';
import { formatDate, monthDay } from '../../core/utils/date';
import { NewsCard } from '../../shared/news-card/news-card';

interface Pillar {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, NewsCard],
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private readonly content = inject(ContentService);

  readonly posts = signal<PostSummary[]>([]);
  readonly event = signal<EventItem | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);

  readonly formatDate = formatDate;
  readonly monthDay = monthDay;

  readonly pillars: Pillar[] = [
    {
      icon: 'education',
      title: 'Educación y Talento',
      description: 'Formación y capacidades para las personas.',
    },
    {
      icon: 'innovation',
      title: 'Innovación y Tecnología',
      description: 'Soluciones y conocimiento aplicado.',
    },
    {
      icon: 'economy',
      title: 'Desarrollo Económico',
      description: 'Empleo y productividad.',
    },
    {
      icon: 'articulation',
      title: 'Articulación',
      description: 'Estado, empresas y academia trabajando juntos.',
    },
  ];

  ngOnInit(): void {
    this.content.getPosts({ limit: 3 }).subscribe({
      next: (response) => {
        this.posts.set(response.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });

    this.content.getEvents().subscribe({
      next: (response) => this.event.set(response.upcoming[0] ?? null),
      error: () => this.event.set(null),
    });
  }
}
