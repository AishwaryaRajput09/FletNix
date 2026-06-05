import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../../services/auth.service';
import { Show, ShowService } from '../../services/show.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-netflix-dark text-white flex flex-col font-sans">
      
      <nav class="sticky top-0 z-40 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex items-center gap-3">
          <span class="text-3xl font-black tracking-wider text-netflix-red font-display cursor-pointer hover:scale-105 transition">FletNix</span>
        </div>
        
        <div class="flex items-center gap-4" *ngIf="user">
          <div class="text-right hidden sm:block">
            <p class="text-xs text-netflix-gray">Signed in as</p>
            <p class="text-sm font-semibold text-white">{{ user.email }}</p>
          </div>

          <button 
            (click)="onLogout()" 
            class="bg-transparent hover:bg-netflix-red/10 text-white border border-white/20 hover:border-netflix-red px-4 py-2 rounded-xl text-sm font-medium transition active:scale-95 flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </nav>

      <section class="px-6 md:px-12 max-w-7xl mx-auto w-full mb-8">
        <div class="glass-panel p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
          
          <div class="relative w-full md:max-w-md">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-netflix-gray">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (ngModelChange)="onSearchChange($event)"
              placeholder="Search by movie title or cast..." 
              class="glass-input w-full pl-11 pr-4 py-3 rounded-xl placeholder-netflix-gray"
            />
          </div>

          <div class="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button 
              (click)="onTypeFilter('')" 
              [class]="selectedType === '' 
                ? 'bg-netflix-red text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-red-950/20 text-sm whitespace-nowrap' 
                : 'bg-white/5 hover:bg-white/10 text-gray-300 px-5 py-2.5 rounded-xl text-sm transition whitespace-nowrap'"
            >
              All Shows
            </button>
            <button 
              (click)="onTypeFilter('Movie')" 
              [class]="selectedType === 'Movie' 
                ? 'bg-netflix-red text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-red-950/20 text-sm whitespace-nowrap' 
                : 'bg-white/5 hover:bg-white/10 text-gray-300 px-5 py-2.5 rounded-xl text-sm transition whitespace-nowrap'"
            >
              Movies
            </button>
            <button 
              (click)="onTypeFilter('TV Show')" 
              [class]="selectedType === 'TV Show' 
                ? 'bg-netflix-red text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-red-950/20 text-sm whitespace-nowrap' 
                : 'bg-white/5 hover:bg-white/10 text-gray-300 px-5 py-2.5 rounded-xl text-sm transition whitespace-nowrap'"
            >
              TV Shows
            </button>
          </div>

        </div>
      </section>

      <main class="flex-grow px-6 md:px-12 max-w-7xl mx-auto w-full mb-12">
        
        <div class="flex flex-col justify-center items-center py-24 gap-4" *ngIf="isLoading">
          <svg class="animate-spin h-10 w-10 text-netflix-red" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-netflix-gray font-light">Loading streaming catalog...</span>
        </div>

        <div *ngIf="!isLoading && shows.length === 0" class="glass-panel p-16 rounded-2xl text-center shadow-lg">
          <svg class="w-16 h-16 text-netflix-gray mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
          <h3 class="text-xl font-bold mb-2">No Shows or Movies Found</h3>
          <p class="text-netflix-gray max-w-md mx-auto font-light">
            We couldn't find anything matching your search query. Try typing something else or check your spelling!
          </p>
        </div>

        <div *ngIf="!isLoading && shows.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            *ngFor="let show of shows" 
            (click)="onSelectShow(show)"
            class="group bg-netflix-black/60 border border-white/5 hover:border-netflix-red/50 rounded-2xl p-6 cursor-pointer shadow-lg hover:shadow-netflix-red/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div class="flex justify-between items-center mb-4">
                <span [class]="show.type === 'Movie' 
                  ? 'bg-blue-900/30 text-blue-400 border border-blue-500/20 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider' 
                  : 'bg-purple-900/30 text-purple-400 border border-purple-500/20 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider'">
                  {{ show.type }}
                </span>
                
                <span *ngIf="show.rating" [class]="show.rating === 'R' 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 text-xs px-2 py-0.5 rounded font-bold' 
                  : 'bg-white/10 text-gray-300 text-xs px-2 py-0.5 rounded font-medium'">
                  {{ show.rating }}
                </span>
              </div>

              <h3 class="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-netflix-red transition duration-200">
                {{ show.title }}
              </h3>

              <div class="flex items-center gap-2 text-xs text-netflix-gray mb-3 font-medium">
                <span>{{ show.release_year }}</span>
                <span>•</span>
                <span>{{ show.duration }}</span>
              </div>

              <p class="text-gray-400 text-sm font-light mb-4 line-clamp-2 leading-relaxed">
                {{ show.description }}
              </p>
            </div>

            <div class="border-t border-white/5 pt-4 mt-auto">
              <span class="text-xs text-netflix-gray block truncate font-medium">
                {{ show.listed_in }}
              </span>
            </div>

          </div>
        </div>

        <div *ngIf="!isLoading && shows.length > 0" class="mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/5 pt-6">
          <p class="text-sm text-netflix-gray font-light">
            Showing <span class="font-bold text-white">{{ (currentPage - 1) * 15 + 1 }}</span> to 
            <span class="font-bold text-white">{{ min((currentPage * 15), totalCount) }}</span> of 
            <span class="font-bold text-white">{{ totalCount }}</span> entries
          </p>

          <div class="flex items-center gap-2">
            <button 
              (click)="onPageChange(currentPage - 1)" 
              [disabled]="currentPage === 1"
              class="glass-panel hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none px-4 py-2 rounded-xl text-sm font-medium transition active:scale-95 flex items-center gap-1"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Prev
            </button>

            <span class="text-sm text-white px-3 font-semibold">
              Page {{ currentPage }} / {{ totalPages }}
            </span>

            <button 
              (click)="onPageChange(currentPage + 1)" 
              [disabled]="currentPage === totalPages"
              class="glass-panel hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none px-4 py-2 rounded-xl text-sm font-medium transition active:scale-95 flex items-center gap-1"
            >
              Next
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

      </main>

      <div 
        *ngIf="selectedShow" 
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
        (click)="onCloseModal()"
      >
        <div 
          class="glass-panel w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative animate-scale-up"
          (click)="$event.stopPropagation()"
        >
          <div class="h-28 bg-gradient-to-r from-red-950 to-netflix-black border-b border-white/10 flex items-center px-8">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-netflix-red bg-red-950/50 border border-netflix-red/30 px-2.5 py-0.5 rounded-full">
                {{ selectedShow.type }}
              </span>
              <h2 class="text-2xl sm:text-3xl font-black text-white mt-2">{{ selectedShow.title }}</h2>
            </div>
          </div>

          <button 
            (click)="onCloseModal()" 
            class="absolute top-4 right-4 bg-black/60 hover:bg-netflix-red/20 text-white rounded-full p-2 border border-white/10 hover:border-netflix-red transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
            
            <div class="flex flex-wrap items-center gap-4 text-sm text-netflix-gray">
              <span class="text-white font-semibold">{{ selectedShow.release_year }}</span>
              <span>•</span>
              <span class="text-white font-semibold">{{ selectedShow.duration }}</span>
              <span *ngIf="selectedShow.rating" class="border border-white/20 px-2 py-0.5 rounded text-white text-xs font-bold bg-white/5">
                {{ selectedShow.rating }}
              </span>
              <span *ngIf="selectedShow.country" class="truncate max-w-[200px]">📍 {{ selectedShow.country }}</span>
            </div>

            <div>
              <h4 class="text-xs uppercase font-bold text-netflix-red tracking-wider mb-2">Description</h4>
              <p class="text-gray-300 text-sm leading-relaxed font-light">{{ selectedShow.description }}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/5">
              <div *ngIf="selectedShow.director">
                <h4 class="text-xs uppercase font-bold text-netflix-red tracking-wider mb-1">Director</h4>
                <p class="text-white text-sm font-medium">{{ selectedShow.director }}</p>
              </div>

              <div>
                <h4 class="text-xs uppercase font-bold text-netflix-red tracking-wider mb-1">Genre</h4>
                <p class="text-white text-sm font-medium">{{ selectedShow.listed_in }}</p>
              </div>
            </div>

            <div *ngIf="selectedShow.cast" class="pt-4 border-t border-white/5">
              <h4 class="text-xs uppercase font-bold text-netflix-red tracking-wider mb-2">Cast</h4>
              <div class="flex flex-wrap gap-1.5">
                <span 
                  *ngFor="let actor of splitCast(selectedShow.cast)" 
                  class="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-light text-gray-300 hover:bg-netflix-red/10 hover:border-netflix-red/20 transition cursor-default"
                >
                  {{ actor }}
                </span>
              </div>
            </div>

            <div *ngIf="selectedShow.date_added" class="pt-4 border-t border-white/5 text-xs text-netflix-gray font-light">
              Added to Netflix on {{ selectedShow.date_added }}
            </div>

          </div>
        </div>
      </div>

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
  ) {}

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
    this.isLoading = true;
    this.showService.getShowById(show._id).subscribe({
      next: (detailedShow) => {
        this.selectedShow = detailedShow;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load detailed show data', err);
        this.isLoading = false;
        alert(err.error?.error || 'Failed to retrieve detailed catalog data.');
      }
    });
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
