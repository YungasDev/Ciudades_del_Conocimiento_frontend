import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ContentService } from '../../core/services/content.service';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './contact.html',
})
export class Contact implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly content = inject(ContentService);
  private readonly route = inject(ActivatedRoute);

  readonly sending = signal(false);
  readonly sent = signal(false);
  readonly error = signal(false);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    organization: [''],
    sector: ['OTRO'],
    message: ['', [Validators.required, Validators.minLength(20)]],
    consent: [false, [Validators.requiredTrue]],
  });

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('motivo') === 'mesa-de-enlace') {
      this.form.patchValue({ sector: 'OTRO' });
    }
  }

  submit(): void {
    if (this.form.invalid || this.sending()) {
      this.form.markAllAsTouched();
      return;
    }

    this.sending.set(true);
    this.error.set(false);
    this.sent.set(false);

    this.content.sendContact(this.form.getRawValue()).subscribe({
      next: () => {
        this.sending.set(false);
        this.sent.set(true);
        this.form.reset({
          name: '',
          email: '',
          organization: '',
          sector: 'OTRO',
          message: '',
          consent: false,
        });
      },
      error: () => {
        this.sending.set(false);
        this.error.set(true);
      },
    });
  }
}
