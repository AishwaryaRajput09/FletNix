import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';
import { Show, ShowService } from '../../services/show.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  LucideLogOut,
  LucideSearch,
  LucideFilm,
  LucideTv,
  LucideCalendar,
  LucideUser,
  LucideChevronLeft,
  LucideChevronRight,
  LucideLayoutGrid
} from '@lucide/angular';
import { SpinnerComponent } from '../shared/spinner.component';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideLogOut,
    LucideSearch,
    LucideFilm,
    LucideTv,
    LucideCalendar,
    LucideUser,
    LucideChevronLeft,
    LucideChevronRight,
    LucideLayoutGrid,
    SpinnerComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  shows: Show[] = [];
  isLoading = false;

  searchQuery = '';
  selectedType = '';
  searchSubject = new Subject<string>();

  currentPage = 1;
  totalPages = 1;
  totalCount = 0;

  constructor(
    private authService: AuthService,
    private showService: ShowService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    this.searchSubject.pipe(
      debounceTime(250),
      distinctUntilChanged()
    ).subscribe(search => {
      this.searchQuery = search;
      this.currentPage = 1;
      this.loadShows();
    });

    this.loadShows();
  }

  loadShows(): void {
    this.isLoading = true;
    this.showService.getShows(this.currentPage, this.searchQuery, this.selectedType).subscribe({
      next: (res) => {
        this.shows = res.data;
        this.totalCount = res.total;
        this.totalPages = res.pages;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching shows', err);
        this.isLoading = false;
        if (err.status === 401 || err.status === 403) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  onTypeFilter(type: string): void {
    this.selectedType = type;
    this.currentPage = 1;
    this.loadShows();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadShows();
    }
  }

  onSelectShow(show: Show): void {
    this.router.navigate(['/dashboard', show._id]);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

}