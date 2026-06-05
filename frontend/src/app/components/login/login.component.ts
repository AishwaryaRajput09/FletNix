import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="relative min-h-screen flex items-center justify-center bg-cover bg-center px-4" style="background-image: linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('https://images.unsplash.com/photo-1574375927938-d5a98e8edd86?q=80&w=1400');">
      <div class="glass-panel w-full max-w-md p-8 md:p-10 rounded-2xl shadow-2xl relative overflow-hidden">
        
        <div class="text-center mb-8">
          <h1 class="text-4xl font-extrabold tracking-tight text-netflix-red mb-2 font-display">FletNix</h1>
          <p class="text-gray-400 text-sm font-light">Confused what to watch? Find it here.</p>
        </div>

        <h2 class="text-2xl font-bold text-white mb-6">Sign In</h2>

        <div *ngIf="error" class="mb-4 bg-red-900/30 border border-red-500 text-red-200 text-sm px-4 py-3 rounded-lg flex items-center gap-2 animate-pulse">
          <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <span>{{ error }}</span>
        </div>

        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="space-y-5">
          <div>
            <label class="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              name="email" 
              [(ngModel)]="email" 
              required 
              email
              #emailInput="ngModel"
              placeholder="name@domain.com"
              class="glass-input w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none"
            />
            <div *ngIf="emailInput.invalid && (emailInput.dirty || emailInput.touched)" class="text-red-400 text-xs mt-1">
              Please enter a valid email address.
            </div>
          </div>

          <div>
            <label class="block text-gray-300 text-xs font-semibold uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              name="password" 
              [(ngModel)]="password" 
              required 
              minlength="6"
              #passwordInput="ngModel"
              placeholder="••••••••"
              class="glass-input w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 focus:outline-none"
            />
            <div *ngIf="passwordInput.invalid && (passwordInput.dirty || passwordInput.touched)" class="text-red-400 text-xs mt-1">
              Password must be at least 6 characters.
            </div>
          </div>

          <button 
            type="submit" 
            [disabled]="loginForm.invalid || isLoading"
            class="w-full bg-netflix-red hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-xl transition duration-300 shadow-lg shadow-red-950/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-4"
          >
            <svg *ngIf="isLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ isLoading ? 'Signing In...' : 'Sign In' }}</span>
          </button>
        </form>

        <div class="mt-8 text-center border-t border-white/5 pt-6">
          <p class="text-gray-400 text-sm">
            New to FletNix? 
            <a routerLink="/register" class="text-white hover:text-netflix-red font-semibold underline transition duration-255 ml-1">Sign up now</a>.
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
