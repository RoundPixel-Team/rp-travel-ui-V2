import { Pipe, PipeTransform } from '@angular/core';
import { airPorts } from '../../home-page/interfaces';

@Pipe({
  name: 'filterAirport'
})

export class FilterAirportPipe implements PipeTransform {

  transform(value: airPorts[], args: string) {
    if (!value || !args) {
      return [];
    }
    else {
      if(args.length< 1){
        return [];
       }
       let airportsMap = new Map();
       let airportsArr: airPorts[] = [];
       let lastAirportsArr: airPorts[] = [];
       let cityName: string="";
       let lastCityName:string="";
     
       for(let i=0; i< value.length; i++){
         if(value[i].cityName.toLowerCase().includes(args.toLowerCase()) || value[i].cityCode.toLowerCase().includes(args.toLowerCase())){
           cityName = value[i].cityName;
           airportsArr.push(value[i]);
           if(lastCityName == cityName){
             lastAirportsArr.push(value[i]);
             airportsMap.set(cityName,[...lastAirportsArr]);
           }
           else{
             airportsMap.set(cityName,[...airportsArr]);
             lastAirportsArr=[];
             lastAirportsArr.push(value[i]);
             lastCityName = value[i].cityName;
           }
         }
         airportsArr=[];
       }
      return [...airportsMap];
    }
  }

}
