import { Pipe, PipeTransform } from '@angular/core';
import { countries } from '../../home-page/interfaces';

@Pipe({
  name: 'councode'
})
export class CouncodePipe implements PipeTransform {
  transform(value: countries[], args: string): countries[] {
    if (!value || !args) {
      return value;
    }
    else {
      if(args.length< 1){
        return [];
       }
      let result: countries[] = []
      for (let index = 0; index < value.length; index++) {
        let element: countries = value[index];
        let a = element.countryName.toLowerCase();
       
        if (a.indexOf(args.toLowerCase()) != -1 ) {
          result.push(element);
        }

      }
      return result;
    }
  }

}
