import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hourminute'
})
export class HourMinutePipe implements PipeTransform {

  transform(value: number, lang: 'en' | 'ar' = 'en'): string {
    const hours = value / 60 | 0 ;
    const minutes =  value % 60 | 0;

    if(lang === 'ar') {
      return hours + ' س' + minutes + ' د';
    }

    return hours + ' h' + minutes + ' m';
  }

}
