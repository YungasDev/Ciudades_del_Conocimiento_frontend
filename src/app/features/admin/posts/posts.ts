import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category, PostSummary } from '../../../core/models/api.models';
import { AdminService } from '../../../core/services/admin.service';
import { formatDate } from '../../../core/utils/date';

@Component({
  selector: 'app-admin-posts',
  imports: [RouterLink],
  templateUrl: './posts.html',
})
export class AdminPosts implements OnInit {
  private readonly admin = inject(AdminService);

  readonly posts = signal<PostSummary[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly loading = signal(true);
  readonly status = signal('');
  readonly query = signal('');
  readonly page = signal(1);
  readonly totalPages = signal(1);
  readonly message = signal('');

  readonly formatDate = formatDate;

  ngOnInit(): void {
    this.admin.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: () => this.categories.set([]),
    });
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.admin
      .getPosts({
        page: this.page(),
        limit: 10,
        status: this.status() || undefined,
        q: this.query() || undefined,
      })
      .subscribe({
        next: (response) => {
          this.posts.set(response.data);
          this.totalPages.set(response.meta.totalPages);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.message.set('No pudimos cargar las novedades.');
        },
      });
  }

  filterStatus(status: string): void {
    this.status.set(status);
    this.page.set(1);
    this.load();
  }

  search(value: string): void {
    this.query.set(value);
    this.page.set(1);
    this.load();
  }

  changeStatus(post: PostSummary, status: string): void {
    this.admin.setPostStatus(post.id, status).subscribe({
      next: () => {
        this.message.set(
          status === 'PUBLISHED'
            ? 'Novedad publicada.'
            : 'Novedad despublicada.',
        );
        this.load();
      },
      error: () => this.message.set('No pudimos cambiar el estado.'),
    });
  }

  remove(post: PostSummary): void {
    if (!confirm(`¿Eliminar "${post.title}"? Esta acción se puede deshacer desde la base.`)) {
      return;
    }
    this.admin.deletePost(post.id).subscribe({
      next: () => {
        this.message.set('Novedad eliminada.');
        this.load();
      },
      error: () => this.message.set('No pudimos eliminar la novedad.'),
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.page.set(page);
    this.load();
  }
}
