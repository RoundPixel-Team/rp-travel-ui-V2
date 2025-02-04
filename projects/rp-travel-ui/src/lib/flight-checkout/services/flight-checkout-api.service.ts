import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, retry, take } from 'rxjs';
import { EnvironmentService } from '../../shared/services/environment.service';
import {
  BookingRequest,
  Cobon,
  flightOfflineService,
  selectedFlight
} from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class FlightCheckoutApiService {
  public http = inject(HttpClient);
  public env = inject(EnvironmentService);

  constructor() {}

  /**
   *
   * @param searchid
   * @param sequenceNum
   * @param providerKey
   * @returns all information about the selected flight according to its searchId , sequence number and provider key
   */
  getSelectedFlight(
    searchid: string,
    sequenceNum: number,
    providerKey: number,
    pcc: string
  ) {
    let api = `${this.env.searchflow}/api/GetSelectedFlight?searchid=${searchid}&SequenceNum=${sequenceNum}&PKey=${providerKey}&sCode=${pcc}`;
    return this.http.get<selectedFlight>(api).pipe(
      retry(3),
      take(1),
      catchError((err) => {
        throw err;
      })
    );
  }

  /**
   *
   * @param SID
   * @param POS
   * @returns a list of offline services provided for a flight reservation using the search ID and the POS
   */
  offlineServices(SID: string, POS: string) {
    let api = `${this.env.BookingFlow}/api/GetOfflineServices?SID=${SID}&POS=${POS}`;
    return this.http.get<flightOfflineService[]>(api).pipe(
      retry(2),
      take(1),
      catchError((err) => {
        console.error(err);
        throw err;
      })
    );
  }

  /**
   *
   * @param promo
   * @param Sid
   * @param sequenceNum
   * @param pkey
   * @returns disscount amount if the copoun code is active and valid
   */
  activateCobon(
    promo: string,
    Sid: string,
    sequenceNum: any,
    pkey: string,
    pcc: string
  ) {
    //check the validity of cobon and return
    let api = `${this.env.BookingFlow}/api/GetPromotionDetails?PromoCode=${promo}&SearchId=${Sid}&SeqNum=${sequenceNum}&PKey=${pkey}&sCode=${pcc}`;
    return this.http.get<Cobon>(api).pipe(take(1));
  }

  /**
   *
   * @param searchid
   * @param sequenceNum
   * @param body
   * @param pkey
   * @param lang
   * @param selectedServices
   * @returns this function is resposible to call the save booking then checking flight validations and them generate your payment link
   */
  saveBooking(body: BookingRequest) {
    let api = `${this.env.BookingFlow}/api/BookItinerary`;
    return this.http.post<any>(api, body).pipe(
      take(1),
      retry(1),
      catchError((err) => {
        console.error(err);
        throw err;
      })
    );
  }
}
