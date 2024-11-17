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
   * Sends a GET request to retrieve the authenticated user's profile data.
   *
   * @param {string} token - The authentication token for the user.
   * @returns {Observable<IUserResponse>} - An observable containing the user data required for authentication.
   */
  getUserProfileApi(token: string):Observable<IUserResponse> {
    let api = `${this.env.users}/api/user/getUser`
    return this.http.get<any>(api, {headers: {token}}).pipe(take(1), catchError(err=>{throw err}))
  }

  /**
   * Sends a POST request to update the user's profile data.
   *
   * @param {string} token - The authentication token for the user.
   * @param {any} body - The updated profile data.
   * @returns {Observable<IUserResponse>} - An observable containing the updated user data.
   */
  editUserProfileApi(token: string, body: any):Observable<IUserResponse> {
    let api = `${this.env.users}/api/user/editUser`
    return this.http.post<any>(api, body, {headers: {token}}).pipe(take(1), catchError(err=>{throw err}))
  }

  /**
   * Sends a POST request to change the user's password.
   *
   * @param {string} token - The authentication token for the user.
   * @param {any} body - The data containing the current and new password values.
   * @returns {Observable<any>} - An observable that emits the result of the password change operation.
   */
  changePasswordApi(token: string, body: any):Observable<any> {
    let api = `${this.env.users}/api/user/changePassword`
    return this.http.post<any>(api, body, {headers: {token}}).pipe(take(1), catchError(err=>{throw err}))
  }
}
