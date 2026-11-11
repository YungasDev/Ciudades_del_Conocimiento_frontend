import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  Category,
  PostDetail,
  PostSummary,
} from '../../core/models/api.models';
import { ContentService } from '../../core/services/content.service';
import { formatDate } from '../../core/utils/date';
import { NewsCard } from '../../shared/news-card/news-card';

@Component({
  selector: 'app-news-detail',
  imports: [RouterLink, NewsCard],
  templateUrl: './news-detail.html',
})
export class NewsDetail implements OnInit {
  private readonly content = inject(ContentService);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  readonly post = signal<PostDetail | null>(null);
  readonly latest = signal<PostSummary[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly loading = signal(true);
  readonly notFound = signal(false);
  readonly copied = signal(false);

  readonly paragraphs = computed(() => {
    const content = this.post()?.content ?? '';
    return content
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  });

  readonly formatDate = formatDate;

  ngOnInit(): void {
    this.content.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
      error: () => this.categories.set([]),
    });

    this.content.getPosts({ limit: 3 }).subscribe({
      next: (response) => this.latest.set(response.data),
      error: () => this.latest.set([]),
    });

    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (!slug) {
        this.notFound.set(true);
        this.loading.set(false);
        return;
      }
      this.load(slug);
    });
  }

  shareWhatsApp(): void {
    const post = this.post();
    if (!post) return;
    const url = window.location.href;
    const text = `${post.title} — ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }

  shareFacebook(): void {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  }

  async copyLink(): Promise<void> {
    await navigator.clipboard.writeText(window.location.href);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2200);
  }

  private load(slug: string): void {
    this.loading.set(true);
    this.notFound.set(false);

    this.content.getPost(slug).subscribe({
      next: (post) => {
        this.post.set(post);
        this.loading.set(false);
        this.title.setTitle(`${post.title} — Ciudades del Conocimiento`);
        this.meta.updateTag({
          name: 'description',
          content: post.seoDescription ?? post.excerpt,
        });
        this.meta.updateTag({
          property: 'og:title',
          content: post.seoTitle ?? post.title,
        });
        this.meta.updateTag({
          property: 'og:description',
          content: post.seoDescription ?? post.excerpt,
        });
        if (post.cover) {
          this.meta.updateTag({
            property: 'og:image',
            content: post.cover.url,
          });
        }
      },
      error: () => {
        this.loading.set(false);
        this.notFound.set(true);
      },
    });
  }
}
