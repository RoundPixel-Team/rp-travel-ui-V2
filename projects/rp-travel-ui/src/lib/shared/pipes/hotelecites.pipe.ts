import { Pipe, PipeTransform } from '@angular/core';
import { hotelCities } from '../../home-page/interfaces';

@Pipe({
  name: 'hotelecites'
})
export class HotelecitesPipe implements PipeTransform {

  transform(value: hotelCities[], args: string): hotelCities[] {
    if (!value || !args) {
      return [];
    }
    else {
      if(args.length< 3){
       return [];
      }
      let result: hotelCities[] = []
      for (let index = 0; index < value.length; index++) {
        let element: hotelCities = value[index];
        let a = element.City.toLowerCase();
        let b = element.Country.toLowerCase();
        if (a.indexOf(args.toLowerCase()) != -1 || b.indexOf(args.toLowerCase()) != -1  ) {
          result.push(element);
        }

      }
      return result;
    }
  }

}
