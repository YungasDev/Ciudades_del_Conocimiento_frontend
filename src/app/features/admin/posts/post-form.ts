import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Category } from '../../../core/models/api.models';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-post-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './post-form.html',
})
export class PostForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly admin = inject(AdminService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly categories = signal<Category[]>([]);
  readonly editingId = signal<string | null>(null);
  readonly coverUrl = signal<string | null>(null);
  readonly coverMediaId = signal<string | null>(null);
  readonly uploading = signal(false);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly loading = signal(true);

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    excerpt: ['', [Validators.required, Validators.minLength(20)]],
    content: ['', [Validators.required, Validators.minLength(20)]],
    categoryId: ['', [Validators.required]],
    status: ['DRAFT'],
    featured: [false],
    publishedAt: [''],
    coverAlt: [''],
    seoTitle: [''],
    seoDescription: [''],
  });

  ngOnInit(): void {
    this.admin.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        if (this.categories().length > 0 && !this.form.controls.categoryId.value) {
          this.form.patchValue({ categoryId: this.categories()[0].id });
        }
      },
      error: () => this.error.set('No pudimos cargar las categorías.'),
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.loading.set(false);
      return;
    }

    this.editingId.set(id);
    this.admin.getPost(id).subscribe({
      next: (post) => {
        this.form.patchValue({
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          categoryId: post.categoryId ?? '',
          status: post.status,
          featured: post.featured,
          publishedAt: this.toLocalInput(post.publishedAt),
          coverAlt: post.cover?.alt ?? '',
          seoTitle: post.seoTitle ?? '',
          seoDescription: post.seoDescription ?? '',
        });
        this.coverMediaId.set(post.coverMediaId);
        this.coverUrl.set(post.cover?.url ?? null);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No pudimos cargar la novedad.');
        this.loading.set(false);
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploading.set(true);
    this.error.set('');
    const alt =
      this.form.controls.coverAlt.value.trim() ||
      this.form.controls.title.value.trim() ||
      'Imagen de la novedad';

    this.admin.uploadMedia(file, alt).subscribe({
      next: (media) => {
        this.coverMediaId.set(media.id);
        this.coverUrl.set(media.path);
        this.form.patchValue({ coverAlt: media.alt });
        this.uploading.set(false);
        input.value = '';
      },
      error: () => {
        this.uploading.set(false);
        this.error.set('No pudimos subir la imagen. Usá JPG, PNG, WebP o AVIF de hasta 5 MB.');
      },
    });
  }

  removeCover(): void {
    this.coverMediaId.set(null);
    this.coverUrl.set(null);
    this.form.patchValue({ coverAlt: '' });
  }

  save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set('');

    const value = this.form.getRawValue();
    const payload = {
      title: value.title.trim(),
      excerpt: value.excerpt.trim(),
      content: value.content,
      categoryId: value.categoryId,
      status: value.status,
      featured: value.featured,
      publishedAt: value.publishedAt
        ? new Date(value.publishedAt).toISOString()
        : null,
      coverMediaId: this.coverMediaId(),
      seoTitle: value.seoTitle.trim(),
      seoDescription: value.seoDescription.trim(),
    };

    const id = this.editingId();
    const request = id
      ? this.admin.updatePost(id, payload)
      : this.admin.createPost(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        void this.router.navigate(['/admin/novedades']);
      },
      error: (err) => {
        this.saving.set(false);
        const message = err?.error?.message;
        this.error.set(
          Array.isArray(message)
            ? message.join(' ')
            : message ?? 'No pudimos guardar la novedad.',
        );
      },
    });
  }

  private toLocalInput(value: string | null): string {
    if (!value) return '';
    const date = new Date(value);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
}
