import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LucideMail, LucideLock, LucideLogIn } from '@lucide/angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideMail, LucideLock, LucideLogIn],
  template: `
    <div class="relative min-h-screen flex items-center justify-center p-4" style="background-image: url('https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=1400'); background-size: cover; background-position: center;">
      <div class="absolute inset-0" style="background: rgba(21, 20, 20, 0.65);"></div>
      <div class="absolute inset-0 opacity-[0.03]" style="background-image: url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E&quot;)"></div>

      <div class="relative z-10 w-full max-w-lg px-14 py-14 rounded-xl" style="background: rgba(0, 0, 0, 0.35); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); border: 1px solid rgba(232, 160, 32, 0.2);">
        
        <div class="mb-8">
          <h1 class="text-4xl font-normal tracking-widest text-fletnix-red mb-2 font-display italic">FletNix</h1>
          <p class="text-white/70 text-sm italic">Welcome back, Sign in to search movies and shows.</p>
        </div>

        <h2 class="font-display text-3xl font-normal text-white mb-8">Sign In</h2>

        <div *ngIf="error" class="mb-4 bg-red-900/30 border border-red-500 text-red-200 text-sm px-4 py-3 rounded-lg flex items-center gap-2 animate-pulse">
          <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <span>{{ error }}</span>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="space-y-5">
          <div>
            <label class="block text-fletnix-gray text-xs font-normal tracking-widest mb-2">Email Address</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-fletnix-gray">
                <svg lucideMail class="w-4 h-4"></svg>
              </span>
              <input 
                type="email" 
                name="email" 
                [(ngModel)]="email" 
                required 
                email
                #emailInput="ngModel"
                placeholder="name@domain.com"
                class="fletnix-input w-full pl-10 pr-4 py-3 rounded-none text-white placeholder-gray-500 focus:outline-none"
                style="background: rgba(0,0,0,0.4); color: #e8e0d5;"
              />
            </div>
            <div *ngIf="emailInput.invalid && (emailInput.dirty || emailInput.touched)" class="text-red-400 text-xs mt-1">
              Please enter a valid email address.
            </div>
          </div>

          <div>
            <label class="block text-fletnix-gray text-xs font-normal tracking-widest mb-2">Password</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-fletnix-gray">
                <svg lucideLock class="w-4 h-4"></svg>
              </span>
              <input 
                type="password" 
                name="password" 
                [(ngModel)]="password" 
                required 
                minlength="6"
                #passwordInput="ngModel"
                placeholder="••••••••"
                class="fletnix-input w-full pl-10 pr-4 py-3 rounded-none text-white placeholder-gray-500 focus:outline-none"
                style="background: rgba(0,0,0,0.4); color: #e8e0d5;"
              />
            </div>
            <div *ngIf="passwordInput.invalid && (passwordInput.dirty || passwordInput.touched)" class="text-red-400 text-xs mt-1">
              Password must be at least 6 characters.
            </div>
          </div>

          <button 
            type="submit" 
            [disabled]="loginForm.invalid || isLoading"
            class="w-full bg-transparent hover:bg-fletnix-red/10 text-fletnix-red font-normal py-3.5 px-4 rounded-none transition duration-300 border border-fletnix-red flex items-center justify-center gap-2 mt-6 tracking-widest text-sm uppercase"
          >
            <svg *ngIf="isLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg *ngIf="!isLoading" lucideLogIn class="w-4 h-4"></svg>
            <span>{{ isLoading ? 'Signing In...' : 'Sign In' }}</span>
          </button>
        </form>

        <div class="mt-8 border-t border-white/5 pt-6">
          <p class="text-gray-400 text-sm">
            New to FletNix? 
            <a routerLink="/register" class="text-white hover:text-fletnix-red font-semibold underline transition duration-255 ml-1">Sign up now</a>.
          </p>
        </div>

      </div>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (!this.email || !this.password) return;

    this.isLoading = true;
    this.error = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.error || 'Invalid credentials or connection issue.';
        console.error('Login error', err);
      }
    });
  }
}
