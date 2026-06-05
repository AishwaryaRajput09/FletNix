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
  LucideStar,
  LucideFileText,
  LucideX,
  LucideMapPin,
  LucideTag,
  LucideLayoutGrid
} from '@lucide/angular';


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
    LucideStar,
    LucideFileText,
    LucideX,
    LucideMapPin,
    LucideTag,
    LucideLayoutGrid
  ],
  template: `
    <div class="min-h-screen text-white flex flex-col font-sans" *ngIf="!selectedShow"
      style="background-color: #100e0a;">

      <nav class="sticky top-0 z-40 py-4 px-8 md:px-16 flex justify-between items-center"
        style="background: rgba(12, 10, 7, 0.97); border-bottom: 1px solid rgba(232, 160, 32, 0.1);">
        <span class="text-xl font-normal tracking-widest text-fletnix-red font-display italic cursor-pointer select-none">FletNix</span>

        <div class="flex items-center gap-4" *ngIf="user">
          <p class="text-xs text-fletnix-gray hidden sm:block">{{ user.email }}</p>
          <button
            (click)="onLogout()"
            class="flex items-center gap-2 text-xs text-fletnix-gray hover:text-white border border-white/10 hover:border-white/20 px-3 py-1.5 transition-all duration-200"
          >
            <svg lucideLogOut class="w-3.5 h-3.5"></svg>
            Logout
          </button>
        </div>
      </nav>

      <div class="px-8 md:px-16 py-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-7xl mx-auto w-full"
        style="border-bottom: 1px solid rgba(255,255,255,0.04);">

        <div class="relative flex-1">
          <span class="absolute inset-y-0 left-3 flex items-center pointer-events-none text-fletnix-gray">
            <svg lucideSearch class="w-4 h-4"></svg>
          </span>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearchChange($event)"
            placeholder="Search by title or cast..."
            class="fletnix-input w-full pl-9 pr-4 py-2.5 text-sm text-white placeholder-fletnix-gray"
            style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 6px;"
          />
        </div>

        <div class="flex gap-1">
          <button
            (click)="onTypeFilter('')"
            [class]="selectedType === ''
              ? 'flex items-center gap-1.5 px-4 py-2.5 text-xs tracking-widest uppercase font-bold transition-all duration-200 text-black bg-fletnix-red'
              : 'flex items-center gap-1.5 px-4 py-2.5 text-xs tracking-widest uppercase transition-all duration-200 text-fletnix-gray hover:text-white'"
            style="border: 1px solid rgba(232,160,32,0.15); border-radius: 6px;"
          >
            <svg lucideLayoutGrid class="w-3.5 h-3.5"></svg>
            All
          </button>
          <button
            (click)="onTypeFilter('Movie')"
            [class]="selectedType === 'Movie'
              ? 'flex items-center gap-1.5 px-4 py-2.5 text-xs tracking-widest uppercase font-bold transition-all duration-200 text-black bg-fletnix-red'
              : 'flex items-center gap-1.5 px-4 py-2.5 text-xs tracking-widest uppercase transition-all duration-200 text-fletnix-gray hover:text-white'"
            style="border: 1px solid rgba(232,160,32,0.15); border-radius: 6px;"
          >
            <svg lucideFilm class="w-3.5 h-3.5"></svg>
            Movies
          </button>
          <button
            (click)="onTypeFilter('TV Show')"
            [class]="selectedType === 'TV Show'
              ? 'flex items-center gap-1.5 px-4 py-2.5 text-xs tracking-widest uppercase font-bold transition-all duration-200 text-black bg-fletnix-red'
              : 'flex items-center gap-1.5 px-4 py-2.5 text-xs tracking-widest uppercase transition-all duration-200 text-fletnix-gray hover:text-white'"
            style="border: 1px solid rgba(232,160,32,0.15); border-radius: 6px;"
          >
            <svg lucideTv class="w-3.5 h-3.5"></svg>
            TV
          </button>
        </div>
      </div>

      <main class="flex-grow px-8 md:px-16 py-8 max-w-7xl mx-auto w-full mb-12">

        <div class="flex flex-col justify-center items-center py-32 gap-4" *ngIf="isLoading">
          <svg class="animate-spin h-8 w-8 text-fletnix-red" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-xs text-fletnix-gray tracking-widest uppercase">Loading catalog...</span>
        </div>

        <div *ngIf="!isLoading && shows.length === 0" class="py-32 text-center">
          <p class="text-fletnix-gray text-sm">Nothing matched your search.</p>
        </div>

        <div *ngIf="!isLoading && shows.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            *ngFor="let show of shows"
            (click)="onSelectShow(show)"
            class="group cursor-pointer transition-all duration-200 py-5 px-6 flex flex-col gap-2"
            style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-left: 2px solid transparent; border-radius: 6px;"
            onmouseenter="this.style.borderLeftColor='#E8A020'; this.style.background='rgba(232,160,32,0.04)';"
            onmouseleave="this.style.borderLeftColor='transparent'; this.style.background='rgba(255,255,255,0.02)';"
          >
            <div class="flex justify-between items-start">
              <span class="text-[10px] font-bold tracking-widest uppercase text-fletnix-red">{{ show.type }}</span>
              <span *ngIf="show.rating"
                class="text-[10px] font-bold px-1.5 py-0.5 text-fletnix-red shrink-0"
                style="border: 1px solid rgba(232,160,32,0.3); background: rgba(232,160,32,0.08);">
                {{ show.rating }}
              </span>
            </div>

            <h3 class="text-lg font-normal text-white font-display leading-snug">{{ show.title }}</h3>

            <div class="flex items-center gap-2 text-xs text-fletnix-gray">
              <svg lucideCalendar class="w-3 h-3"></svg>
              <span>{{ show.release_year }}</span>
              <span class="opacity-30">•</span>
              <span>{{ show.duration }}</span>
            </div>
          </div>
        </div>

        <div *ngIf="!isLoading && shows.length > 0"
          class="mt-10 flex flex-col sm:flex-row justify-between items-center gap-4 pt-6"
          style="border-top: 1px solid rgba(255,255,255,0.05);">

          <p class="text-xs text-fletnix-gray">
            {{ (currentPage - 1) * 15 + 1 }}–{{ min(currentPage * 15, totalCount) }}
            <span class="opacity-40 mx-1">of</span>
            {{ totalCount }} titles
          </p>

          <div class="flex items-center gap-2">
            <button
              (click)="onPageChange(currentPage - 1)"
              [disabled]="currentPage === 1"
              class="flex items-center gap-1 px-3 py-1.5 text-xs text-fletnix-gray hover:text-white disabled:opacity-25 disabled:pointer-events-none transition-all duration-200"
              style="border: 1px solid rgba(255,255,255,0.07);"
            >
              <svg lucideChevronLeft class="w-3.5 h-3.5"></svg>
              Prev
            </button>

            <span class="text-xs text-white px-3" style="opacity: 0.6;">
              {{ currentPage }} / {{ totalPages }}
            </span>

            <button
              (click)="onPageChange(currentPage + 1)"
              [disabled]="currentPage === totalPages"
              class="flex items-center gap-1 px-3 py-1.5 text-xs text-fletnix-gray hover:text-white disabled:opacity-25 disabled:pointer-events-none transition-all duration-200"
              style="border: 1px solid rgba(255,255,255,0.07);"
            >
              Next
              <svg lucideChevronRight class="w-3.5 h-3.5"></svg>
            </button>
          </div>
        </div>

      </main>
    </div>
  `
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

  selectedShow: Show | null = null;

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

  onCloseModal(): void {
    this.selectedShow = null;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  splitCast(castStr: string): string[] {
    if (!castStr) return [];
    return castStr.split(',').map(c => c.trim()).filter(Boolean);
  }
}