import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, take } from 'rxjs';
import { EnvironmentService } from '../../../shared/services/environment.service';
import { IUserResponse } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserProfileApiService {
  public http = inject(HttpClient)
  public env = inject(EnvironmentService)

  /**
   *
   * @param body [Login form value]
   * @returns all the user data needed to be authinticated within the application
   */
  getUserProfileApi(token: string):Observable<IUserResponse> {
    let api = `${this.env.users}/api/user/getUser`
    return this.http.get<any>(api, {headers: {token}}).pipe(take(1), catchError(err=>{throw err}))
  }

  /**
   *
   * @param body [Login form value]
   * @returns all the user data needed to be authinticated within the application
   */
  editUserProfileApi(token: string, body: any):Observable<IUserResponse> {
    let api = `${this.env.users}/api/user/editUser`
    return this.http.post<any>(api, body, {headers: {token}}).pipe(take(1), catchError(err=>{throw err}))
  }

  /**
   *
   * @param body [Login form value]
   * @returns all the user data needed to be authinticated within the application
   */
  changePasswordApi(token: string, body: any):Observable<any> {
    let api = `${this.env.users}/api/user/changePassword`
    return this.http.post<any>(api, body, {headers: {token}}).pipe(take(1), catchError(err=>{throw err}))
  }
}
