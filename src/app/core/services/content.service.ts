import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Actor,
  Category,
  ContactPayload,
  EventLists,
  Paginated,
  PostDetail,
  PostSummary,
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ContentService {
  private readonly http = inject(HttpClient);

  getPosts(params: {
    page?: number;
    limit?: number;
    category?: string;
    q?: string;
  } = {}): Observable<Paginated<PostSummary>> {
    let httpParams = new HttpParams();
    if (params.page) httpParams = httpParams.set('page', params.page);
    if (params.limit) httpParams = httpParams.set('limit', params.limit);
    if (params.category) {
      httpParams = httpParams.set('category', params.category);
    }
    if (params.q) httpParams = httpParams.set('q', params.q);

    return this.http.get<Paginated<PostSummary>>(
      `${environment.apiUrl}/posts`,
      { params: httpParams },
    );
  }

  getPost(slug: string): Observable<PostDetail> {
    return this.http.get<PostDetail>(
      `${environment.apiUrl}/posts/${slug}`,
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/categories`);
  }

  getActors(sector?: string): Observable<Actor[]> {
    let params = new HttpParams();
    if (sector) params = params.set('sector', sector);
    return this.http.get<Actor[]>(`${environment.apiUrl}/actors`, { params });
  }

  getEvents(): Observable<EventLists> {
    return this.http.get<EventLists>(`${environment.apiUrl}/events`);
  }

  sendContact(payload: ContactPayload): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>(
      `${environment.apiUrl}/contact`,
      payload,
    );
  }
}
