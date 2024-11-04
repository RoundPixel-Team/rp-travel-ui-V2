import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, retry, take } from 'rxjs';
import { EnvironmentService } from '../../../shared/services/environment.service';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  public http = inject(HttpClient)
  public env = inject(EnvironmentService)

  /**
   *
   * @param body [Login form value]
   * @returns all the user data needed to be authinticated within the application
   */
  login(body: any):Observable<any> {
    let api = `${this.env.users}/api/user/Login`
    return this.http.post<any>(api, body).pipe(retry(3), take(1), catchError(err=>{throw err})
    )
  }

  /**
   *
   * @param body [Login form value]
   * @returns all the user data needed to be authinticated within the application
   */
  externalLogin(body: any):Observable<any> {
    let api = `${this.env.users}/api/Account/login`
    return this.http.get(api, body).pipe(retry(3), take(1), catchError(err=>{throw err})
    )
  }

  /**
   *
   * @param body [Signup form value]
   * @returns all the user data needed to be authinticated within the application
   * also saves a new user on the the database
   */
  registeration(body: any):Observable<any> {
    let api = `${this.env.users}/api/user/register`
    return this.http.post<any>(api, body).pipe(retry(3), take(1), catchError(err=>{throw err})
    )
  }
}
