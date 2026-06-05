import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';
import { LucideCheckCircle, LucideAlertTriangle, LucideInfo, LucideX } from '@lucide/angular';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, LucideCheckCircle, LucideAlertTriangle, LucideInfo, LucideX],
  template: `
    <div class="fixed top-5 right-5 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <div 
        *ngFor="let toast of toastService.toasts()" 
        [class]="'toast-card pointer-events-auto relative flex gap-3 p-4 rounded-none border backdrop-blur-md shadow-2xl overflow-hidden ' + getToastClasses(toast.type)"
        [style.--duration]="toast.duration + 'ms'"
      >
        <!-- Dynamic Icon -->
        <span class="flex-shrink-0 mt-0.5">
          <svg *ngIf="toast.type === 'success'" lucideCheckCircle class="w-5 h-5 text-green-400"></svg>
          <svg *ngIf="toast.type === 'error'" lucideAlertTriangle class="w-5 h-5 text-red-500"></svg>
          <svg *ngIf="toast.type === 'warning'" lucideAlertTriangle class="w-5 h-5 text-amber-500"></svg>
          <svg *ngIf="toast.type === 'info'" lucideInfo class="w-5 h-5 text-blue-400"></svg>
        </span>

        <!-- Message -->
        <div class="flex-grow text-sm font-light leading-snug pr-4">
          {{ toast.message }}
        </div>

        <!-- Close Button -->
        <button 
          (click)="toastService.remove(toast.id)"
          class="flex-shrink-0 text-white/40 hover:text-white transition-colors duration-200"
        >
          <svg lucideX class="w-4 h-4"></svg>
        </button>

        <!-- Progress Indicator -->
        <div 
          class="progress-bar absolute bottom-0 left-0 h-[2px]"
          [class]="getProgressBarClasses(toast.type)"
        ></div>
      </div>
    </div>
  `,
  styles: [`
    .toast-card {
      animation: slide-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      background: rgba(17, 16, 16, 0.9);
      letter-spacing: 0.025em;
    }

    .progress-bar {
      animation: progress var(--duration) linear forwards;
    }

    @keyframes slide-in {
      from {
        transform: translateX(120%) translateY(-10px);
        opacity: 0;
      }
      to {
        transform: translateX(0) translateY(0);
        opacity: 1;
      }
    }

    @keyframes progress {
      from { width: 100%; }
      to { width: 0%; }
    }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);

  getToastClasses(type: string): string {
    switch (type) {
      case 'success':
        return 'border-green-500/20 text-green-100/90';
      case 'error':
        return 'border-red-500/20 text-red-100/90';
      case 'warning':
        return 'border-amber-500/20 text-amber-100/90';
      case 'info':
      default:
        return 'border-blue-500/20 text-blue-100/90';
    }
  }

  getProgressBarClasses(type: string): string {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-amber-500';
      case 'info':
      default:
        return 'bg-blue-500';
    }
  }
}
