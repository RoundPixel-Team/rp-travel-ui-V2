import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, retry, take } from 'rxjs';
import { EnvironmentService } from '../../../shared/services/environment.service';
import { ILoginResponse, IRegisterResponse, IOtp, ITrips } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class TripsApiService {
  public http = inject(HttpClient)
  public env = inject(EnvironmentService)

  /**
   * @param body [Login form value]
   * @returns all the user data needed to be authinticated within the application
   */
  getAllTripsApi(Token: string):Observable<ITrips> {
    let api = `${this.env.BookingFlow}/api/HistoryAndUpcomingFlights`;
    const headers = new HttpHeaders({
      'Accept': '*/*',
      'Token': Token
    });

    return this.http.get<any>(api, {headers}).pipe(retry(3),take(1));
  }
}
