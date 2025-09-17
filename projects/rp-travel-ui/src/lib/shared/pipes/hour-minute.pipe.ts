import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hourminute'
})
export class HourMinutePipe implements PipeTransform {

  transform(value: number, lang: 'en' | 'ar' = 'en'): string {
    const hours = value / 60 | 0 ;
    const minutes =  value % 60 | 0;

    let hourText = '';
    let minText = '';

    if(lang === 'ar'){
      hourText = 'ساعة';
      minText = 'دقيقة';
    }else{
      hourText = 'h';
      minText = 'm';
    }

    if(hours && minutes) {
      return `${hours} ${hourText}  ${minutes} ${minText}`;
    } else if(hours) {
      return `${hours} ${hourText}`;
    } else {
      return `${minutes} ${minText}`;
    }
  }
}
