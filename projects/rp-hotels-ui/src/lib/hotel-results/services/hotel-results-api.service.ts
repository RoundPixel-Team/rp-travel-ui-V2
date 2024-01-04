import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EnvironmentService } from '../../shared/services/environment.service';
import { take } from 'rxjs';
import { hotelSearchForm } from '../../hotel-search/interfaces';
import { GetHotelModule, hotelResults } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class HotelResultsApiService {

  public http = inject(HttpClient)
  public env = inject(EnvironmentService)

  constructor(private httpClient : HttpClient) {}

  getHotelsRes(hotelSearch:GetHotelModule){
    let api = `${this.env.Apihotels}/api/HotelSearch`;
    return this.httpClient.post<hotelResults>(api, hotelSearch);
  }  
}
