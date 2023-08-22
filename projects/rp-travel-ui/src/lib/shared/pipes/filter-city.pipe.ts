import { Pipe, PipeTransform } from '@angular/core';
import { airPorts } from '../../home-page/interfaces';
//this pipe take an argument as the input and return a filterd array wich include the search input
@Pipe({
  name: 'filterCity'
})
export class FilterCityPipe implements PipeTransform {

  transform(value: airPorts[], args: string): airPorts[] {
    if (!value || !args) {
      return [];
    }
    else {
      if(args.length< 3){
        return [];
       }
      let result: airPorts[] = []
      for (let index = 0; index < value.length; index++) {
        let element: airPorts = value[index];
        let a = element.cityName.toLowerCase();
        let b = element.airportCode.toLowerCase();
        let c = element.airportName.toLowerCase();
        if (a.indexOf(args.toLowerCase()) != -1 || b.indexOf(args.toLowerCase()) != -1 || c.indexOf(args.toLowerCase()) != -1) {
          result.push(element);
        }

      }
      return result;
    }
  }

}
