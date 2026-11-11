import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EventItem } from '../../core/models/api.models';
import { ContentService } from '../../core/services/content.service';
import { formatDate, formatTime, monthDay } from '../../core/utils/date';

@Component({
  selector: 'app-agenda',
  imports: [RouterLink],
  templateUrl: './agenda.html',
})
export class Agenda implements OnInit {
  private readonly content = inject(ContentService);

  readonly upcoming = signal<EventItem[]>([]);
  readonly past = signal<EventItem[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  readonly formatDate = formatDate;
  readonly formatTime = formatTime;
  readonly monthDay = monthDay;

  ngOnInit(): void {
    this.content.getEvents().subscribe({
      next: (response) => {
        this.upcoming.set(response.upcoming);
        this.past.set(response.past);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      },
    });
  }
}
