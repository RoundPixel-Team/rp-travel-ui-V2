import { Pipe, PipeTransform } from '@angular/core';
import { airPorts } from 'rp-travel-ui';

@Pipe({
  name: 'codToCity'
})
export class CodToCityPipe implements PipeTransform {

  transform(value: string, args: airPorts[]): string {
    if (!value || !args) {
      return value;
    }
    else {
      
      for (let index = 0; index < args.length; index++) {
        let element: airPorts = args[index];
        let a = element.cityCode.toLowerCase();
       
        if (a == value.toLowerCase() ) {
          return element.cityName
        }

      }
      return value;
    }
  }

}
