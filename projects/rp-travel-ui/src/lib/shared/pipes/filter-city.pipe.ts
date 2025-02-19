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
      if(args.length< 1){
        return [];
       }
      let result: airPorts[] = []
      for (let index = 0; index < value.length; index++) {
        let element: airPorts = value[index];

        let cityName = element.cityName.toLowerCase();
        let cityCode = element.cityCode.toLowerCase();
        let airportName = element.airportName.toLowerCase();
        let airportCode = element.airportCode.toLowerCase();
        let countryName = element.countryName.toLowerCase();
        let countryCode = element.countryCode.toLowerCase();
        
        if (
          cityName.indexOf(args.toLowerCase()) != -1 || 
          cityCode.indexOf(args.toLowerCase()) != -1 ||
          airportName.indexOf(args.toLowerCase()) != -1 || 
          airportCode.indexOf(args.toLowerCase()) != -1 ||
          countryName.indexOf(args.toLowerCase()) != -1 ||
          countryCode.indexOf(args.toLowerCase()) != -1 
        ) {
          result.push(element);
        }
      }
      return result;
    }
  }

}
