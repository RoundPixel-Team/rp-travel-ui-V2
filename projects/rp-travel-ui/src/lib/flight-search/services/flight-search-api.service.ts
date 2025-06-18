import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EnvironmentService } from '../../shared/services/environment.service';


@Injectable({
  providedIn: 'root',
})
export class FlightSearchApiService {
  public http = inject(HttpClient);
  public env = inject(EnvironmentService);

  getAirportsApi(searchString: string) {
    let api = `https://backofficeapi.round-pixel.net/api/Airports?searchStr=${searchString}`;

    return this.http.get(api)
  }
}
