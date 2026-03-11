import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EnvironmentService } from '../../shared/services/environment.service';
import { FareRules, FlightSearchResponse, FlightSearchResult, SearchFlightModule, fareRulesResponse } from '../interfaces';
import { catchError, retry, take } from 'rxjs';
import { searchFlightModel } from '../../flight-search/interfaces';

@Injectable({
  providedIn: 'root',
})
export class FlightResultApiService {
  public http = inject(HttpClient);
  public env = inject(EnvironmentService);

  constructor() {}

  searchFlight(searchFlight: SearchFlightModule) {
    let api: string = `${this.env.searchflow}/Flights/FlightsSearch`;

    let flights = searchFlight.flightsInfo.split('_').map((flightStr) => {
      let parts = flightStr.split('-');
      
      let dateString = parts.slice(2).join('-');
      let decodedDateString = decodeURIComponent(dateString);
      let depDateObj = new Date(decodedDateString);
      if (!isNaN(depDateObj.getTime())) {
        let yyyy = depDateObj.getFullYear();
        let mm = String(depDateObj.getMonth() + 1).padStart(2, '0');
        let dd = String(depDateObj.getDate()).padStart(2, '0');
        dateString = `${yyyy}-${mm}-${dd}`;
      } else {
        dateString = decodedDateString;
      }

      return {
        DepartingFrom: parts[0],
        ArrivingTo: parts[1],
        DepartingOnDate: dateString
      };
    });

    let passParts = searchFlight.passengers.split('-');
    let adultNum = passParts.length > 1 ? parseInt(passParts[1], 10) : 1;
    let childNum = passParts.length > 3 ? parseInt(passParts[3], 10) : 0;
    let infantNum = passParts.length > 5 ? parseInt(passParts[5], 10) : 0;

    let payload = {
      SearchId: searchFlight.serachId,
      POS: searchFlight.pointOfReservation,
      Currency: searchFlight.currency,
      Language: searchFlight.lan,
      Flights: flights,
      FlightType: searchFlight.flightType.toLowerCase(),
      PreferredAirline: searchFlight.preferredAirLine === 'all' || !searchFlight.preferredAirLine ? '' : searchFlight.preferredAirLine,
      SelectedFlightClass: searchFlight.Cclass,
      AdultNum: adultNum,
      ChildNum: childNum,
      InfantNum: infantNum,
      SelectDirectFlightsOnly: searchFlight.showDirect
    };

    return this.http.post<FlightSearchResult>(api, payload).pipe(
      retry(2),
      take(1),
      catchError((err) => {
        console.error(err);
        throw err;
      })
    );
  }

  fareRules(sid: string, seq: number, pKey: string) {
    let api = `${this.env.FareRules}/api/GetFareRules?SId=${sid}&SeqNum=${seq}&PKey=${pKey}`;

    return this.http.get<fareRulesResponse>(api).pipe(take(1));
  }

  getBrandedFaresApi(sid: string, seq: number, pKey: string, pcc: string) {
    let api = `${this.env.FareRules}/api/GetBrandedFares?SId=${sid}&SeqNum=${seq}&PKey=${pKey}&Pcc=${pcc}`;

    return this.http.get<FlightSearchResponse>(api).pipe(take(1));
  }
}
