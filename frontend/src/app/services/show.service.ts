import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Show {
  _id: string;
  show_id: string;
  type: 'Movie' | 'TV Show';
  title: string;
  director: string;
  cast: string;
  country: string;
  date_added: string;
  release_year: number;
  rating: string;
  duration: string;
  listed_in: string;
  description: string;
}

export interface PaginatedShowsResponse {
  data: Show[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

@Injectable({
  providedIn: 'root'
})
export class ShowService {
  private apiUrl = `${environment.apiUrl}/shows`;

  constructor(private http: HttpClient) {}

  getShows(page: number = 1, search: string = '', type: string = ''): Observable<PaginatedShowsResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', '15');

    if (search) {
      params = params.set('search', search);
    }
    if (type) {
      params = params.set('type', type);
    }

    return this.http.get<PaginatedShowsResponse>(this.apiUrl, { params });
  }

  getShowById(id: string): Observable<Show> {
    return this.http.get<Show>(`${this.apiUrl}/${id}`);
  }
}
