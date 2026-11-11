import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../../core/models/api.models';
import { AdminService, CategoryPayload } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-categories',
  imports: [ReactiveFormsModule],
  templateUrl: './categories.html',
})
export class AdminCategories implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly fb = inject(FormBuilder);

  readonly categories = signal<Category[]>([]);
  readonly loading = signal(true);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly saving = signal(false);
  readonly message = signal('');
  readonly error = signal('');

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    color: ['#1B6FD1'],
    order: [0],
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.admin.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.message.set('No pudimos cargar las categorías.');
      },
    });
  }

  newCategory(): void {
    this.editingId.set(null);
    this.form.reset({ name: '', description: '', color: '#1B6FD1', order: 0 });
    this.showForm.set(true);
    this.error.set('');
  }

  edit(category: Category): void {
    this.editingId.set(category.id);
    this.form.patchValue({
      name: category.name,
      description: category.description ?? '',
      color: category.color ?? '#1B6FD1',
      order: category.order ?? 0,
    });
    this.showForm.set(true);
    this.error.set('');
  }

  cancel(): void {
    this.showForm.set(false);
    this.error.set('');
  }

  save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: CategoryPayload = {
      name: value.name.trim(),
      description: value.description.trim() || undefined,
      color: value.color.trim() || undefined,
      order: Number(value.order) || 0,
    };

    this.saving.set(true);
    this.error.set('');
    const id = this.editingId();
    const request = id
      ? this.admin.updateCategory(id, payload)
      : this.admin.createCategory(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.message.set(id ? 'Categoría actualizada.' : 'Categoría creada.');
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        const message = err?.error?.message;
        this.error.set(
          Array.isArray(message) ? message.join(' ') : message ?? 'No pudimos guardar la categoría.',
        );
      },
    });
  }

  remove(category: Category): void {
    if (!confirm(`¿Eliminar la categoría "${category.name}"?`)) return;
    this.admin.deleteCategory(category.id).subscribe({
      next: () => {
        this.message.set('Categoría eliminada.');
        this.load();
      },
      error: (err) => {
        const message = err?.error?.message;
        this.message.set(
          Array.isArray(message) ? message.join(' ') : message ?? 'No pudimos eliminar la categoría.',
        );
      },
    });
  }
}
