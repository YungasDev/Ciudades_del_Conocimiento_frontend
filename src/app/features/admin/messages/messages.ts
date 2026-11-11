import { Component, OnInit, inject, signal } from '@angular/core';
import { ContactMessage } from '../../../core/models/api.models';
import { AdminService } from '../../../core/services/admin.service';
import { formatDate, formatTime } from '../../../core/utils/date';

@Component({
  selector: 'app-admin-messages',
  templateUrl: './messages.html',
})
export class AdminMessages implements OnInit {
  private readonly admin = inject(AdminService);

  readonly messages = signal<ContactMessage[]>([]);
  readonly loading = signal(true);
  readonly message = signal('');

  readonly formatDate = formatDate;
  readonly formatTime = formatTime;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.admin.getMessages().subscribe({
      next: (messages) => {
        this.messages.set(messages);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.message.set('No pudimos cargar los mensajes.');
      },
    });
  }

  markRead(item: ContactMessage): void {
    this.admin.markMessageRead(item.id).subscribe({
      next: () => {
        this.messages.update((messages) =>
          messages.map((message) =>
            message.id === item.id ? { ...message, read: true } : message,
          ),
        );
      },
      error: () => this.message.set('No pudimos marcar el mensaje como leído.'),
    });
  }

  sectorLabel(sector: string | null): string {
    const labels: Record<string, string> = {
      GOBIERNO: 'Gobierno',
      EDUCACION: 'Educación',
      SECTOR_PRIVADO: 'Sector privado',
      COMUNIDAD: 'Comunidad',
      OTRO: 'Otro',
    };
    return sector ? labels[sector] ?? sector : '—';
  }
}
