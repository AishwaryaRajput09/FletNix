import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitCast',
  standalone: true
})
export class SplitCastPipe implements PipeTransform {
  transform(value: string): string[] {
    if (!value) return [];
    return value.split(',').map(s => s.trim()).filter(Boolean);
  }
}
