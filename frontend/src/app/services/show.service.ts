import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

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
  private apiUrl = 'https://flet-nix-backend-dev.vercel.app/api/shows';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.token;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

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

    return this.http.get<PaginatedShowsResponse>(this.apiUrl, {
      headers: this.getHeaders(),
      params
    });
  }

  getShowById(id: string): Observable<Show> {
    return this.http.get<Show>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}
