import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: string, lang: 'en' | 'ar' = 'en'): string {
    if (!value) return '';

    const [hours, minutes] = value.split(':').map(Number);

    if(lang === 'ar') {
      return hours + ' س' + ' ' + minutes + ' د';
    }
  
    return hours + ' h' + ' ' + minutes + ' m';
  }
}
