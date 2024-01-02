import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { EnvironmentService } from '../../shared/services/environment.service';

@Injectable({
  providedIn: 'root'
})
export class HotelCheckoutApiService {

  public http = inject(HttpClient)
  public env = inject(EnvironmentService)

  constructor() { }
}
