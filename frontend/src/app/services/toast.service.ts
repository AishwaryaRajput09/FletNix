import { Injectable, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastr = inject(ToastrService);

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
