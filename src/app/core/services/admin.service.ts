import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  Actor,
  Category,
  ContactMessage,
  EventItem,
  Media,
  Paginated,
  PostDetail,
  PostSummary,
  Stats,
} from '../models/api.models';

export interface PostPayload {
  title: string;
  excerpt: string;
  content: string;
  categoryId: string;
  status: string;
  featured: boolean;
  publishedAt?: string | null;
  coverMediaId?: string | null;
  seoTitle?: string;
  seoDescription?: string;
}

export interface CategoryPayload {
  name: string;
  description?: string;
  color?: string;
  order?: number;
}

export interface ActorPayload {
  name: string;
  sector: string;
  description: string;
  websiteUrl?: string;
  contactEmail?: string;
  logoMediaId?: string | null;
  published: boolean;
  consent: boolean;
  consentNote?: string;
  order?: number;
}

export interface EventPayload {
  title: string;
  description: string;
  startsAt: string;
  endsAt?: string | null;
  place: string;
  ctaLabel?: string;
  ctaUrl?: string;
  published: boolean;
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly http = inject(HttpClient);

  getStats(): Observable<Stats> {
    return this.http.get<Stats>(`${environment.apiUrl}/admin/stats`);
  }

  getPosts(params: {
    page?: number;
    limit?: number;
    status?: string;
    q?: string;
  } = {}): Observable<Paginated<PostSummary>> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.limit) httpParams = httpParams.set('limit', params.limit);
    if (params.status) httpParams = httpParams.set('status', params.status);
    if (params.q) httpParams = httpParams.set('q', params.q);
    return this.http.get<Paginated<PostSummary>>(
      `${environment.apiUrl}/admin/posts`,
      { params: httpParams },
    );
  }

  getPost(id: string): Observable<PostDetail> {
    return this.http.get<PostDetail>(
      `${environment.apiUrl}/admin/posts/${id}`,
    );
  }

  createPost(payload: PostPayload): Observable<PostDetail> {
    return this.http.post<PostDetail>(
      `${environment.apiUrl}/admin/posts`,
      payload,
    );
  }

  updatePost(id: string, payload: PostPayload): Observable<PostDetail> {
    return this.http.patch<PostDetail>(
      `${environment.apiUrl}/admin/posts/${id}`,
      payload,
    );
  }

  setPostStatus(id: string, status: string): Observable<PostDetail> {
    return this.http.patch<PostDetail>(
      `${environment.apiUrl}/admin/posts/${id}/status`,
      { status },
    );
  }

  deletePost(id: string): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(
      `${environment.apiUrl}/admin/posts/${id}`,
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
      `${environment.apiUrl}/admin/categories`,
    );
  }

  createCategory(payload: CategoryPayload): Observable<Category> {
    return this.http.post<Category>(
      `${environment.apiUrl}/admin/categories`,
      payload,
    );
  }

  updateCategory(
    id: string,
    payload: CategoryPayload,
  ): Observable<Category> {
    return this.http.patch<Category>(
      `${environment.apiUrl}/admin/categories/${id}`,
      payload,
    );
  }

  deleteCategory(id: string): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(
      `${environment.apiUrl}/admin/categories/${id}`,
    );
  }

  getActors(): Observable<Actor[]> {
    return this.http
      .get<Actor[]>(`${environment.apiUrl}/admin/actors`)
      .pipe(
        map((actors) =>
          actors.map((actor) => ({
            ...actor,
            logo: actor.logo ?? actor.logoMedia ?? null,
          })),
        ),
      );
  }

  createActor(payload: ActorPayload): Observable<Actor> {
    return this.http.post<Actor>(
      `${environment.apiUrl}/admin/actors`,
      payload,
    );
  }

  updateActor(id: string, payload: ActorPayload): Observable<Actor> {
    return this.http.patch<Actor>(
      `${environment.apiUrl}/admin/actors/${id}`,
      payload,
    );
  }

  publishActor(id: string, published: boolean): Observable<Actor> {
    return this.http.patch<Actor>(
      `${environment.apiUrl}/admin/actors/${id}/publish`,
      { published },
    );
  }

  deleteActor(id: string): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(
      `${environment.apiUrl}/admin/actors/${id}`,
    );
  }

  getEvents(): Observable<EventItem[]> {
    return this.http.get<EventItem[]>(
      `${environment.apiUrl}/admin/events`,
    );
  }

  createEvent(payload: EventPayload): Observable<EventItem> {
    return this.http.post<EventItem>(
      `${environment.apiUrl}/admin/events`,
      payload,
    );
  }

  updateEvent(
    id: string,
    payload: EventPayload,
  ): Observable<EventItem> {
    return this.http.patch<EventItem>(
      `${environment.apiUrl}/admin/events/${id}`,
      payload,
    );
  }

  deleteEvent(id: string): Observable<{ ok: boolean }> {
    return this.http.delete<{ ok: boolean }>(
      `${environment.apiUrl}/admin/events/${id}`,
    );
  }

  uploadMedia(file: File, alt: string): Observable<Media> {
    const form = new FormData();
    form.append('file', file);
    form.append('alt', alt);
    return this.http.post<Media>(
      `${environment.apiUrl}/admin/media`,
      form,
    );
  }

  getMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(
      `${environment.apiUrl}/admin/contact`,
    );
  }

  markMessageRead(id: string): Observable<{ ok: boolean }> {
    return this.http.patch<{ ok: boolean }>(
      `${environment.apiUrl}/admin/contact/${id}/read`,
      {},
    );
  }
}
