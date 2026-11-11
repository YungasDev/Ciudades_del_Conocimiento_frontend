import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostSummary } from '../../core/models/api.models';
import { formatDate } from '../../core/utils/date';

@Component({
  selector: 'app-news-card',
  imports: [RouterLink],
  templateUrl: './news-card.html',
})
export class NewsCard {
  readonly post = input.required<PostSummary>();

  readonly formatDate = formatDate;

  coverClass(): string {
    return `cover-${this.post().category?.slug ?? 'programa'}`;
  }
}
