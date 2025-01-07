import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nextLiner',
  standalone: true
})
export class NextLinerPipe implements PipeTransform {

  transform(value: string, limit: number): string | null {
    if (!value || !limit) {
      return value;
    }
    if (value.length <= limit) {
      return value;
    }

    let result = '';
    let start = 0;
    while (start < value.length) {
      result += value.slice(start, start + limit) + '\n';
      start += limit;
    }

    return result;
  }

}
