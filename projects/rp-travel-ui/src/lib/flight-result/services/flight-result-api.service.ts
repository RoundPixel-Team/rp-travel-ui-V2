import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EnvironmentService } from '../../shared/services/environment.service';
import {
  FareRules,
  FlightSearchResponse,
  FlightSearchResult,
  SearchFlightModule,
  fareRulesResponse,
  ISearchFlightAi,
  TravelerResponse,
  ContactResponse,
} from '../interfaces';
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
    let api: string = `${this.env.searchflow}/flights/flightsSearch/${searchFlight.lan}/${searchFlight.currency}/${searchFlight.pointOfReservation}/${searchFlight.flightType}/${searchFlight.flightsInfo}/${searchFlight.passengers}/${searchFlight.Cclass}/${searchFlight.showDirect}/all/0/0/Direct?searchID=${searchFlight.serachId}&DestinationType=${searchFlight.DestinationType}`;

    return this.http.get<FlightSearchResult>(api).pipe(
      retry(2),
      take(1),
      catchError((err) => {
        console.error(err);
        throw err;
      }),
    );
  }
  searchFlightAi(searchFlight: ISearchFlightAi) {
    let api: string = `${this.env.searchflowAi}/webhook/Search`;
    return this.http.post<FlightSearchResult>(api, searchFlight).pipe(
      retry(2),
      take(1),
      catchError((err) => {
        console.error(err);
        throw err;
      }),
    );
  }

  contactDetails(searchFlight: ISearchFlightAi) { 
    let api: string = `${this.env.searchflowAi}/webhook/Contact`;
    return this.http.post<ContactResponse>(api, searchFlight).pipe(
      retry(2),
      take(1),
      catchError((err) => {
        console.error(err);
        throw err;
      }),
    );
  }
  
  bookFlightAi(searchFlight: ISearchFlightAi) {
    let api: string = `${this.env.searchflowAi}/webhook/Book`;
    return this.http.post<TravelerResponse>(api, searchFlight).pipe(
      retry(2),
      take(1),
      catchError((err) => {
        console.error(err);
        throw err;
      }),
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

  getSearchHistory() {
    let api = `http://154.41.209.93:9091/api/conversations/user/titles`;

    return this.http.get(api).pipe(take(2));
  }

  getConversationDetails(chatId: string) {
    let api = `http://154.41.209.93:9091/api/conversations/${chatId}/messages?page=1&pageSize=100`;

    return this.http.get(api).pipe(take(2));
  }
}
