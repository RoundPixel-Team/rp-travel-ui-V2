import { Pipe, PipeTransform } from '@angular/core';
import { airPorts } from '../../home-page/interfaces';

@Pipe({
  name: 'filterAirport'
})

export class FilterAirportPipe implements PipeTransform {

  transform(value: airPorts[], args: string) {
    if (!value || !args.toLowerCase()) {
      return [];
    }
    else {
      if(args.length< 1){
        return [];
       }
       let airportsMap = new Map();
       let airportsArr: airPorts[] = [];
       let cityName: string="";
     
       for(let i=0; i< value.length; i++){
        if(value[i].cityName.toLowerCase().includes(args.toLowerCase()) || value[i].cityCode.toLowerCase().includes(args.toLowerCase())){
          cityName = value[i].cityName.toLowerCase();
          if(airportsMap.has(cityName)){  // If city name exist before then update the new value of this key (City Name)
            airportsArr = airportsMap.get(cityName);  // get old value of this key (City Name)
            airportsArr.push(value[i]);  // add the new object of the same key (City Name)
            airportsMap.set(cityName, [...airportsArr]); //update the value of this key
          }
          else{
            airportsArr.push(value[i]); 
            airportsMap.set(cityName, [...airportsArr]);
          }
          airportsArr = [];
          cityName = '';
        }
        else{
          continue;
        }
      }
      
      return [...airportsMap];
    }
  }

  
}
