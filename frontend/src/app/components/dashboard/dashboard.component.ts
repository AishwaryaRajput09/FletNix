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
    <div class="min-h-screen bg-fletnix-dark text-white flex flex-col font-sans" *ngIf="!selectedShow">
      
      <nav class="sticky top-0 z-40 py-4 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4" style="background: rgba(16, 14, 10, 0.95); border-bottom: 1px solid rgba(232, 160, 32, 0.08);">
        <div class="flex items-center gap-3">
          <span class="text-2xl font-normal tracking-widest text-fletnix-red font-display italic cursor-pointer">FletNix</span>
        </div>
        
        <div class="flex items-center gap-4" *ngIf="user">
          <div class="text-right hidden sm:block">
            <p class="text-xs text-fletnix-gray flex items-center gap-1 justify-end">
              <svg lucideUser class="w-3.5 h-3.5"></svg>
              Signed in as
            </p>
            <p class="text-sm font-semibold text-white">{{ user.email }}</p>
          </div>

          <button 
            (click)="onLogout()" 
            class="bg-transparent hover:bg-white/5 text-fletnix-gray hover:text-white border border-white/10 px-4 py-2 rounded-none text-sm font-medium transition active:scale-95 flex items-center gap-2"
          >
            <svg lucideLogOut class="w-4 h-4"></svg>
            Logout
          </button>
        </div>
      </nav>

      <section class="px-6 md:px-12 max-w-7xl mx-auto w-full mb-2">
        <div class="flex flex-col md:flex-row justify-between items-center gap-6 py-6 border-b border-white/5">
          
          <div class="relative w-full md:max-w-md">
            <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-fletnix-gray">
              <svg lucideSearch class="w-5 h-5"></svg>
            </span>
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (ngModelChange)="onSearchChange($event)"
              placeholder="Search by movie title or cast..." 
              class="fletnix-input w-full pl-11 pr-4 py-3 rounded-none placeholder-fletnix-gray"
              style="background: rgba(20, 16, 8, 0.8);"
            />
          </div>

          <div class="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <button 
              (click)="onTypeFilter('')" 
              [class]="selectedType === '' 
                ? 'bg-fletnix-red text-black font-bold px-6 py-2 rounded-none text-xs tracking-wider uppercase transition flex items-center gap-2' 
                : 'bg-[#141008] hover:bg-white/5 text-fletnix-gray px-6 py-2 rounded-none text-xs tracking-wider uppercase transition flex items-center gap-2'"
            >
              <svg lucideLayoutGrid class="w-4 h-4"></svg>
              All Shows
            </button>
            <button 
              (click)="onTypeFilter('Movie')" 
              [class]="selectedType === 'Movie' 
                ? 'bg-fletnix-red text-black font-bold px-6 py-2 rounded-none text-xs tracking-wider uppercase transition flex items-center gap-2' 
                : 'bg-[#141008] hover:bg-white/5 text-fletnix-gray px-6 py-2 rounded-none text-xs tracking-wider uppercase transition flex items-center gap-2'"
            >
              <svg lucideFilm class="w-4 h-4"></svg>
              Movies
            </button>
            <button 
              (click)="onTypeFilter('TV Show')" 
              [class]="selectedType === 'TV Show' 
                ? 'bg-fletnix-red text-black font-bold px-6 py-2 rounded-none text-xs tracking-wider uppercase transition flex items-center gap-2' 
                : 'bg-[#141008] hover:bg-white/5 text-fletnix-gray px-6 py-2 rounded-none text-xs tracking-wider uppercase transition flex items-center gap-2'"
            >
              <svg lucideTv class="w-4 h-4"></svg>
              TV Shows
            </button>
          </div>

        </div>
      </section>

      <main class="flex-grow px-6 md:px-12 max-w-7xl mx-auto w-full mb-12">
        
        <div class="flex flex-col justify-center items-center py-24 gap-4" *ngIf="isLoading">
          <svg class="animate-spin h-10 w-10 text-fletnix-red" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-fletnix-gray font-light">Loading streaming catalog...</span>
        </div>

        <div *ngIf="!isLoading && shows.length === 0" class="fletnix-panel p-16 rounded-2xl text-center shadow-lg">
          <svg class="w-16 h-16 text-fletnix-gray mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
          <h3 class="text-xl font-bold mb-2">No Shows or Movies Found</h3>
          <p class="text-fletnix-gray max-w-md mx-auto font-light">
            We couldn't find anything matching your search query. Try typing something else or check your spelling!
          </p>
        </div>

        <div *ngIf="!isLoading && shows.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5">
          <div 
            *ngFor="let show of shows" 
            (click)="onSelectShow(show)"
            class="group border border-[#2a2210] hover:border-fletnix-red/30 bg-[#141008] hover:bg-[#1a1510] py-6 px-6 cursor-pointer transition-all duration-200 flex flex-col gap-3 rounded-none"
          >
            <div>
              <div class="flex justify-between items-center mb-3">
                <span class="text-fletnix-red text-xs font-black uppercase tracking-widest font-display group-hover:opacity-80">
                  {{ show.type }}
                </span>
                
                <span *ngIf="show.rating" class="text-xs text-fletnix-gray font-mono">
                  {{ show.rating }}
                </span>
              </div>

              <h3 class="text-xl font-normal text-white font-display transition duration-200">
                {{ show.title }}
              </h3>

              <div class="flex items-center gap-2 text-xs text-fletnix-gray font-medium">
                <span class="flex items-center gap-1">
                  <svg lucideCalendar class="w-3.5 h-3.5"></svg>
                  {{ show.release_year }}
                </span>
                <span>•</span>
                <span>{{ show.duration }}</span>
              </div>
            </div>

          </div>
        </div>

        <div *ngIf="!isLoading && shows.length > 0" class="mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/5 pt-6">
          <p class="text-sm text-fletnix-gray font-light">
            Showing <span class="font-bold text-white">{{ (currentPage - 1) * 15 + 1 }}</span> to 
            <span class="font-bold text-white">{{ min((currentPage * 15), totalCount) }}</span> of 
            <span class="font-bold text-white">{{ totalCount }}</span> entries
          </p>

          <div class="flex items-center gap-2">
            <button 
              (click)="onPageChange(currentPage - 1)" 
              [disabled]="currentPage === 1"
              class="fletnix-panel hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none px-4 py-2 rounded-none text-sm font-medium transition active:scale-95 flex items-center gap-1"
            >
              <svg lucideChevronLeft class="w-4 h-4"></svg>
              Prev
            </button>

            <span class="text-sm text-white px-3 font-semibold">
              Page {{ currentPage }} / {{ totalPages }}
            </span>

            <button 
              (click)="onPageChange(currentPage + 1)" 
              [disabled]="currentPage === totalPages"
              class="fletnix-panel hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none px-4 py-2 rounded-none text-sm font-medium transition active:scale-95 flex items-center gap-1"
            >
              Next
              <svg lucideChevronRight class="w-4 h-4"></svg>
            </button>
          </div>
        </div>

      </main>
    </div>
      <div 
        *ngIf="selectedShow" 
        class="min-h-screen bg-fletnix-dark px-6 md:px-16 py-16 max-w-3xl mx-auto w-full"
      >
        <div class="w-full relative">
          <button 
            (click)="onCloseModal()" 
            class="mb-10 flex items-center gap-2 text-sm text-fletnix-gray hover:text-white transition cursor-pointer"
          >
            <svg lucideChevronLeft class="w-4 h-4"></svg>
            ← Back to results
          </button>

          <div class="border-b border-white/10 pb-6 mb-6">
            <span class="text-xs font-black uppercase tracking-widest text-fletnix-red font-display">
              {{ selectedShow.type }}
            </span>
            <h2 class="text-5xl font-normal text-white mt-2 mb-6 font-display leading-tight">{{ selectedShow.title }}</h2>
          </div>

          <div class="space-y-6 pt-4">
            
            <div class="flex flex-wrap items-center gap-4 text-sm text-fletnix-gray">
              <span class="text-white font-semibold flex items-center gap-1">
                <svg lucideCalendar class="w-4 h-4"></svg>
                {{ selectedShow.release_year }}
              </span>
              <span>•</span>
              <span class="text-white font-semibold">{{ selectedShow.duration }}</span>
              <span *ngIf="selectedShow.rating" class="border border-white/20 px-2 py-0.5 rounded text-white text-xs font-bold bg-white/5 flex items-center gap-1">
                <svg lucideStar class="w-3.5 h-3.5 text-yellow-500 fill-yellow-500"></svg>
                {{ selectedShow.rating }}
              </span>
              <span *ngIf="selectedShow.country" class="truncate max-w-[200px] flex items-center gap-1">
                <svg lucideMapPin class="w-4 h-4"></svg>
                {{ selectedShow.country }}
              </span>
            </div>

            <div>
              <h4 class="text-xs uppercase font-mono text-fletnix-red tracking-widest mb-2"><svg lucideFileText class="w-4 h-4 inline mr-1"></svg> DESCRIPTION</h4>
              <p class="text-gray-300 text-sm leading-relaxed font-light">{{ selectedShow.description }}</p>
              <div class="w-16 h-px bg-fletnix-red my-8"></div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
              <div *ngIf="selectedShow.director">
                <h4 class="text-xs uppercase font-mono text-fletnix-red tracking-widest mb-2"><svg lucideUser class="w-3.5 h-3.5 inline mr-1"></svg> DIRECTOR</h4>
                <p class="text-white text-sm font-medium">{{ selectedShow.director }}</p>
              </div>

              <div>
                <h4 class="text-xs uppercase font-mono text-fletnix-red tracking-widest mb-2"><svg lucideTag class="w-3.5 h-3.5 inline mr-1"></svg> GENRE</h4>
                <p class="text-white text-sm font-medium">{{ selectedShow.listed_in }}</p>
              </div>

              <div *ngIf="selectedShow.country">
                <h4 class="text-xs uppercase font-mono text-fletnix-red tracking-widest mb-2"><svg lucideMapPin class="w-3.5 h-3.5 inline mr-1"></svg> COUNTRY</h4>
                <p class="text-white text-sm font-medium">{{ selectedShow.country }}</p>
              </div>
            </div>

            <div *ngIf="selectedShow.cast" class="pt-4 border-t border-white/5">
              <h4 class="text-xs uppercase font-mono text-fletnix-red tracking-widest mb-2"><svg lucideUser class="w-3.5 h-3.5 inline mr-1"></svg> CAST</h4>
              <div class="flex flex-wrap gap-1.5">
                <span 
                  *ngFor="let actor of splitCast(selectedShow.cast)" 
                  class="text-sm text-fletnix-gray border-b border-white/10 pb-1 mr-4"
                >
                  {{ actor }}
                </span>
              </div>
            </div>

            <div *ngIf="selectedShow.date_added" class="pt-8 mt-4 border-t border-white/5 text-xs text-fletnix-gray/40 font-mono">
              Added to FletNix on {{ selectedShow.date_added }}
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
    this.isLoading = true;
    this.showService.getShowById(show._id).subscribe({
      next: (detailedShow) => {
        this.selectedShow = detailedShow;
        window.scrollTo(0, 0);
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
