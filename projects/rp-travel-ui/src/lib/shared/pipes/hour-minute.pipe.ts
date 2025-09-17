import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hourminute'
})
export class HourMinutePipe implements PipeTransform {

  transform(value: number, lang: 'en' | 'ar' = 'en'): string {
    const hours = value / 60 | 0 ;
    const minutes =  value % 60 | 0;

    if(lang === 'ar') {
      if(hours && minutes) {
        return hours + ' ساعة' + ' ' + minutes + ' دقيقة';
      } if(hours) {
        return hours + ' ساعة';
      } else {
        return minutes + ' دقيقة';
      }
    }

    if(hours && minutes) {
      return hours + ' h' + ' ' + minutes + ' m';
    } if(hours) {
      return hours + ' h' ;
    } else {
      return minutes + ' m';
    }
  }
}
