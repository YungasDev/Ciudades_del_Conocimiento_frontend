import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Actor } from '../../../core/models/api.models';
import { AdminService, ActorPayload } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-actors',
  imports: [ReactiveFormsModule],
  templateUrl: './actors.html',
})
export class AdminActors implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly fb = inject(FormBuilder);

  readonly actors = signal<Actor[]>([]);
  readonly loading = signal(true);
  readonly showForm = signal(false);
  readonly editingId = signal<string | null>(null);
  readonly logoUrl = signal<string | null>(null);
  readonly logoMediaId = signal<string | null>(null);
  readonly uploading = signal(false);
  readonly saving = signal(false);
  readonly message = signal('');
  readonly error = signal('');

  readonly sectors = [
    ['GOBIERNO', 'Gobierno municipal'],
    ['EDUCACION', 'Educación'],
    ['SECTOR_PRIVADO', 'Sector privado'],
    ['COMUNIDAD', 'Comunidad'],
  ];

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    sector: ['GOBIERNO', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    websiteUrl: [''],
    contactEmail: [''],
    consent: [false],
    consentNote: [''],
    published: [false],
    order: [0],
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.admin.getActors().subscribe({
      next: (actors) => {
        this.actors.set(actors);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.message.set('No pudimos cargar las instituciones.');
      },
    });
  }

  newActor(): void {
    this.editingId.set(null);
    this.form.reset({
      name: '',
      sector: 'GOBIERNO',
      description: '',
      websiteUrl: '',
      contactEmail: '',
      consent: false,
      consentNote: '',
      published: false,
      order: 0,
    });
    this.logoUrl.set(null);
    this.logoMediaId.set(null);
    this.error.set('');
    this.showForm.set(true);
  }

  edit(actor: Actor): void {
    this.editingId.set(actor.id);
    this.form.patchValue({
      name: actor.name,
      sector: actor.sector,
      description: actor.description,
      websiteUrl: actor.websiteUrl ?? '',
      contactEmail: actor.contactEmail ?? '',
      consent: actor.consent ?? false,
      consentNote: actor.consentNote ?? '',
      published: actor.published ?? false,
      order: actor.order ?? 0,
    });
    this.logoUrl.set(actor.logo?.url ?? null);
    this.logoMediaId.set(actor.logoMediaId ?? null);
    this.error.set('');
    this.showForm.set(true);
  }

  cancel(): void {
    this.showForm.set(false);
    this.error.set('');
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploading.set(true);
    this.admin
      .uploadMedia(file, `Logo de ${this.form.controls.name.value || 'institución'}`)
      .subscribe({
        next: (media) => {
          this.logoMediaId.set(media.id);
          this.logoUrl.set(media.path);
          this.uploading.set(false);
          input.value = '';
        },
        error: () => {
          this.uploading.set(false);
          this.error.set('No pudimos subir el logo. Usá una imagen de hasta 5 MB.');
        },
      });
  }

  save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const payload: ActorPayload = {
      name: value.name.trim(),
      sector: value.sector,
      description: value.description.trim(),
      websiteUrl: value.websiteUrl.trim() || undefined,
      contactEmail: value.contactEmail.trim() || undefined,
      logoMediaId: this.logoMediaId(),
      consent: value.consent,
      consentNote: value.consentNote.trim() || undefined,
      published: value.published,
      order: Number(value.order) || 0,
    };

    if (payload.published && !payload.consent) {
      this.error.set('Para publicar la institución primero registrá su consentimiento.');
      return;
    }

    this.saving.set(true);
    this.error.set('');
    const id = this.editingId();
    const request = id
      ? this.admin.updateActor(id, payload)
      : this.admin.createActor(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.message.set(
          id ? 'Institución actualizada.' : 'Institución creada.',
        );
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        const message = err?.error?.message;
        this.error.set(
          Array.isArray(message)
            ? message.join(' ')
            : message ?? 'No pudimos guardar la institución.',
        );
      },
    });
  }

  togglePublish(actor: Actor): void {
    const next = !(actor.published ?? false);
    this.admin.publishActor(actor.id, next).subscribe({
      next: () => {
        this.message.set(next ? 'Institución publicada.' : 'Institución despublicada.');
        this.load();
      },
      error: (err) => {
        const message = err?.error?.message;
        this.message.set(
          Array.isArray(message)
            ? message.join(' ')
            : message ?? 'No se pudo cambiar la publicación. Verificá el consentimiento.',
        );
      },
    });
  }

  remove(actor: Actor): void {
    if (!confirm(`¿Eliminar "${actor.name}" del directorio?`)) return;
    this.admin.deleteActor(actor.id).subscribe({
      next: () => {
        this.message.set('Institución eliminada.');
        this.load();
      },
      error: () => this.message.set('No pudimos eliminar la institución.'),
    });
  }
}
