import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Category, PostSummary } from '../../core/models/api.models';
import { ContentService } from '../../core/services/content.service';
import { NewsCard } from '../../shared/news-card/news-card';

@Component({
  selector: 'app-news-list',
  imports: [RouterLink, NewsCard],
  templateUrl: './news-list.html',
})
export class NewsList implements OnInit {
  private readonly content = inject(ContentService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly posts = signal<PostSummary[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);
  readonly page = signal(1);
  readonly totalPages = signal(1);
  readonly total = signal(0);
  readonly category = signal('');
  readonly query = signal('');
  readonly searchTerm = signal('');

  readonly pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index + 1),
  );

  ngOnInit(): void {
    this.content.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: () => this.categories.set([]),
    });

    this.route.queryParamMap.subscribe((params) => {
      this.page.set(Math.max(1, Number(params.get('pagina')) || 1));
      this.category.set(params.get('categoria') ?? '');
      this.query.set(params.get('q') ?? '');
      this.searchTerm.set(this.query());
      this.load();
    });
  }

  selectCategory(slug: string): void {
    this.updateParams({ categoria: slug || null, pagina: null });
  }

  submitSearch(event: Event): void {
    event.preventDefault();
    this.updateParams({ q: this.searchTerm().trim() || null, pagina: null });
  }

  onSearchInput(value: string): void {
    this.searchTerm.set(value);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.updateParams({ pagina: page === 1 ? null : page });
  }

  clearFilters(): void {
    this.searchTerm.set('');
    void this.router.navigate(['/novedades']);
  }

  private updateParams(params: Record<string, string | number | null>): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge',
    });
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(false);

    this.content
      .getPosts({
        page: this.page(),
        limit: 9,
        category: this.category() || undefined,
        q: this.query() || undefined,
      })
      .subscribe({
        next: (response) => {
          this.posts.set(response.data);
          this.totalPages.set(response.meta.totalPages);
          this.total.set(response.meta.total);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.error.set(true);
        },
      });
  }
}
