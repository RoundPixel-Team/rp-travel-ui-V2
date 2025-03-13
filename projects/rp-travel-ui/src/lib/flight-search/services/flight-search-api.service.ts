import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EnvironmentService } from '../../shared/services/environment.service';


@Injectable({
  providedIn: 'root',
})
export class FlightSearchApiService {
  public http = inject(HttpClient);
  public env = inject(EnvironmentService);

  getAirportsApi(lang: 'en' | 'ar', searchString: string) {
    let api = `${this.env.backOffice}/api/GetSearchFlowMapping?langCode=${lang}&searchStr=${searchString}`;

    return this.http.get(api)
  }
}
