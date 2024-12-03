import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EnvironmentService } from '../../shared/services/environment.service';
import { FareRules, FlightSearchResult, SearchFlightModule, fareRulesResponse } from '../interfaces';
import { catchError, retry, take } from 'rxjs';
import { searchFlightModel } from '../../flight-search/interfaces';

@Injectable({
  providedIn: 'root'
})
export class FlightResultApiService {

  public http = inject(HttpClient)
  public env = inject(EnvironmentService)

  constructor() { }


  searchFlight(searchFlight: SearchFlightModule) {
    let api: string = `${this.env.searchflow}/flights/flightsSearch/${searchFlight.lan}/${searchFlight.currency}/${searchFlight.pointOfReservation}/${searchFlight.flightType}/${searchFlight.flightsInfo}/${searchFlight.passengers}/${searchFlight.Cclass}/${searchFlight.showDirect}/all/0/0/Direct?searchID=${searchFlight.serachId}`;
    return this.http.get<FlightSearchResult>(api).pipe(retry(2), take(1),catchError(err=>{console.log(err);throw err}) );;
  }

  fareRules(sid: string, seq: number, pKey: string) {
    let api = `${this.env.FareRules}/api/GetFareRules?SId=${sid}&SeqNum=${seq}&PKey=${pKey}`;
    console.log(api);

    return this.http.get<fareRulesResponse>(api).pipe(take(1));
  }
}
