import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LucideMail, LucideLock, LucideCalendar, LucideUserPlus, LucideEye, LucideEyeOff } from '@lucide/angular';
import { ToastService } from '../../services/toast.service';
import { SpinnerComponent } from '../shared/spinner.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideMail, LucideLock, LucideCalendar, LucideUserPlus, LucideEye, LucideEyeOff, SpinnerComponent],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  email = '';
  password = '';
  dob = '';
  computedAge: number | null = null;
  isLoading = false;
  showPassword = false;
  maxDate = new Date().toISOString().split('T')[0];
  minDate = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 120);
    return d.toISOString().split('T')[0];
  })();


  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    if (this.authService.isAuthenticated) {
      this.router.navigate(['/dashboard']);
    }
  }

  calculateAge(dobString: string): number {
    if (!dobString) return 0;
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  }

  onDobChange(value: string): void {
    if (value && value > this.maxDate) {
      this.toastService.error('Invalid date of birth');
      this.dob = '';
      this.computedAge = null;
      return;
    }
    if (value && value < this.minDate) {
      this.toastService.error('Age must be under 120');
      this.dob = '';
      this.computedAge = null;
      return;
    }
    this.computedAge = value ? this.calculateAge(value) : null;
  }

  onSubmit(): void {
    if (!this.email || !this.password || !this.dob) return;
    if (this.dob > this.maxDate) {
      this.toastService.error('Invalid date of birth');
      return;
    }
    if (this.dob < this.minDate) {
      this.toastService.error('Age must be under 120');
      return;
    }
    this.isLoading = true;
    this.authService.register({
      email: this.email,
      password: this.password,
      age: this.calculateAge(this.dob)
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.toastService.success(res.message || 'Account created');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.toastService.error(err.error?.error || 'Registration failed');
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}