import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'dateFormatShort'
})
export class DateFormatShortPipe implements PipeTransform {

  heckIfPlural(value: number){
    if(value != 1){
      return true;
    }
    return false;
  }

  transform(value: any): string {
    if(value){
      const now = new Date();
      const date = new Date(value);
      const secondsBetween = Math.floor((now.getTime() - date.getTime()) / 1000);

      if(secondsBetween < 60){
        return `${secondsBetween} s`;
      }
      if(secondsBetween < 3600){
        return `${Math.floor(secondsBetween / 60)} m`;
      }
      if(secondsBetween < 86400){

        return `${Math.floor(secondsBetween / 3600)} h`;
      }
      if(secondsBetween < 2592000){
        return `${Math.floor(secondsBetween / 86400)} d`;
      }
      if(secondsBetween < 31104000){
        return `${Math.floor(secondsBetween / 2592000)} mt`;
      }else{
        return `${Math.floor(secondsBetween / 31104000)} y`;
      }

    }
    return "pipe-error//null value";
  }

}
