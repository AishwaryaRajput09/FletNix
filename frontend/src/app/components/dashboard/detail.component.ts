import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Show, ShowService } from '../../services/show.service';
import { AuthService } from '../../services/auth.service';
import {
  LucideChevronLeft,
  LucideCalendar,
  LucideUser,
  LucideFileText,
  LucideMapPin,
  LucideTag
} from '@lucide/angular';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    CommonModule,
    LucideChevronLeft,
    LucideCalendar,
    LucideUser,
    LucideFileText,
    LucideMapPin,
    LucideTag
  ],
  templateUrl: './detail.component.html'
})
export class DetailComponent implements OnInit {
  show: Show | null = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private showService: ShowService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['/dashboard']); return; }

    this.isLoading = true;
    this.showService.getShowById(id).subscribe({
      next: (show) => { 
        this.show = show; 
        this.isLoading = false; 
      },
      error: (err) => { 
        this.isLoading = false; 
        if (err.status === 401 || err.status === 403) {
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  splitCast(castStr: string): string[] {
    if (!castStr) return [];
    return castStr.split(',').map(c => c.trim()).filter(Boolean);
  }
}