import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventItem } from '../../../core/models/api.models';
import { AdminService, EventPayload } from '../../../core/services/admin.service';
import { formatDate, formatTime } from '../../../core/utils/date';

@Component({
  selector: 'app-admin-events',
  imports: [ReactiveFormsModule],
  templateUrl: './events.html',
})
export class AdminEvents implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly fb = inject(FormBuilder);

  readonly events = signal<EventItem[]>([]);
  readonly loading = signal(true);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly saving = signal(false);
  readonly message = signal('');
  readonly error = signal('');

  readonly formatDate = formatDate;
  readonly formatTime = formatTime;

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    startsAt: ['', [Validators.required]],
    endsAt: [''],
    place: ['', [Validators.required, Validators.minLength(3)]],
    ctaLabel: [''],
    ctaUrl: [''],
    published: [true],
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.admin.getEvents().subscribe({
      next: (events) => {
        this.events.set(events);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.message.set('No pudimos cargar los eventos.');
      },
    });
  }

  newEvent(): void {
    this.editingId.set(null);
    this.form.reset({
      title: '',
      description: '',
      startsAt: '',
      endsAt: '',
      place: '',
      ctaLabel: '',
      ctaUrl: '',
      published: true,
    });
    this.showForm.set(true);
    this.error.set('');
  }

  edit(event: EventItem): void {
    this.editingId.set(event.id);
    this.form.patchValue({
      title: event.title,
      description: event.description,
      startsAt: this.toLocalInput(event.startsAt),
      endsAt: this.toLocalInput(event.endsAt),
      place: event.place,
      ctaLabel: event.ctaLabel ?? '',
      ctaUrl: event.ctaUrl ?? '',
      published: event.published,
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
    const payload: EventPayload = {
      title: value.title.trim(),
      description: value.description.trim(),
      startsAt: new Date(value.startsAt).toISOString(),
      endsAt: value.endsAt ? new Date(value.endsAt).toISOString() : null,
      place: value.place.trim(),
      ctaLabel: value.ctaLabel.trim() || undefined,
      ctaUrl: value.ctaUrl.trim() || undefined,
      published: value.published,
    };

    this.saving.set(true);
    this.error.set('');
    const id = this.editingId();
    const request = id
      ? this.admin.updateEvent(id, payload)
      : this.admin.createEvent(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.message.set(id ? 'Evento actualizado.' : 'Evento creado.');
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        const message = err?.error?.message;
        this.error.set(
          Array.isArray(message) ? message.join(' ') : message ?? 'No pudimos guardar el evento.',
        );
      },
    });
  }

  remove(event: EventItem): void {
    if (!confirm(`¿Eliminar el evento "${event.title}"?`)) return;
    this.admin.deleteEvent(event.id).subscribe({
      next: () => {
        this.message.set('Evento eliminado.');
        this.load();
      },
      error: () => this.message.set('No pudimos eliminar el evento.'),
    });
  }

  private toLocalInput(value: string | null): string {
    if (!value) return '';
    const date = new Date(value);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
}
