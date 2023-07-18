import { Injectable, inject } from '@angular/core';
import { EnvironmentService } from '../../shared/services/environment.service';
import { HttpClient } from '@angular/common/http';
import { userLoginForm, userModel, userSignupForm } from '../interfaces';
import { Observable, catchError, retry, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserManagmentApiService {

  public http = inject(HttpClient)
  public env = inject(EnvironmentService)

  constructor() { }


  /**
   * 
   * @param body [Login form value]
   * @returns all the user data needed to be authinticated within the application
   */
  login(body: userLoginForm):Observable<userModel> {
    let api = `${this.env.users}/api/Account/Login`
    return this.http.post<userModel>(api, body).pipe(retry(3), take(1), catchError(err=>{throw err})
    )
  }

  /**
   * 
   * @param body [Signup form value]
   * @returns all the user data needed to be authinticated within the application
   * also saves a new user on the the database
   */
  signup(body: userSignupForm):Observable<userModel> {
    let api = `${this.env.users}/api/Account/Register`
    return this.http.post<userModel>(api, body).pipe(retry(3), take(1), catchError(err=>{throw err})
    )
  }
}
