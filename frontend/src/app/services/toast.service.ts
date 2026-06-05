import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastr = inject(ToastrService);

  show(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 4000) {
    const options = { timeOut: duration };
    if (type === 'success') {
      this.toastr.success(message, '', options);
    } else if (type === 'error') {
      this.toastr.error(message, '', options);
    } else if (type === 'warning') {
      this.toastr.warning(message, '', options);
    } else {
      this.toastr.info(message, '', options);
    }
  }

  success(message: string, duration?: number) {
    this.toastr.success(message, '', duration ? { timeOut: duration } : undefined);
  }

  error(message: string, duration?: number) {
    this.toastr.error(message, '', duration ? { timeOut: duration } : undefined);
  }

  warning(message: string, duration?: number) {
    this.toastr.warning(message, '', duration ? { timeOut: duration } : undefined);
  }

  info(message: string, duration?: number) {
    this.toastr.info(message, '', duration ? { timeOut: duration } : undefined);
  }
}

