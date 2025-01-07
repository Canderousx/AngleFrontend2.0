import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'simpleDate',
  standalone: true
})
export class SimpleDatePipe implements PipeTransform {

  transform(value: any): string {
    if(value){
      const date = new Date(value);
      return  date.toDateString();
    }
    return "";
  }

}
