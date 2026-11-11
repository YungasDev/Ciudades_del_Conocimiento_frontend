import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PostSummary, Stats } from '../../../core/models/api.models';
import { AdminService } from '../../../core/services/admin.service';
import { formatDate } from '../../../core/utils/date';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private readonly admin = inject(AdminService);

  readonly stats = signal<Stats | null>(null);
  readonly posts = signal<PostSummary[]>([]);
  readonly loading = signal(true);

  readonly formatDate = formatDate;

  ngOnInit(): void {
    this.admin.getStats().subscribe({
      next: (stats) => this.stats.set(stats),
      error: () => this.stats.set(null),
    });

    this.admin.getPosts({ limit: 5 }).subscribe({
      next: (response) => {
        this.posts.set(response.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
