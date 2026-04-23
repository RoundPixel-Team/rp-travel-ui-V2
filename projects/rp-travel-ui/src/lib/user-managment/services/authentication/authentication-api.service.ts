import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, retry, take } from 'rxjs';
import { EnvironmentService } from '../../../shared/services/environment.service';
import { 
  ILoginResponse, 
  IRegisterResponse, 
  IOtp, 
  IResetPasswordForm, 
  ILoginForm, 
  IForgetPasswordForm, 
  IForgetPasswordResponse, 
  IResetPasswordResponse, 
  IVerifyResetPasswordToken, 
  GoogleAuthResponse
} from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  public http = inject(HttpClient);
  public env = inject(EnvironmentService);

  /**
   * Sends a login request to the API.
   *
   * @param body - Login form data containing user credentials.
   * @returns An observable with the login response, containing user authentication data.
   */
  login(body: ILoginForm): Observable<ILoginResponse> {
    const api = `${this.env.users}/api/user/Login`;
    return this.http.post<ILoginResponse>(api, body).pipe(
      take(1),
      catchError(err => { throw err; })
    );
  }

  /**
   * Sends a request to initiate the forgot password process.
   *
   * @param body - Forget password form data containing the email or username.
   * @returns An observable with the forget password response.
   */
  forgetPasswordApi(body: IForgetPasswordForm): Observable<IForgetPasswordResponse> {
    const api = `${this.env.users}/api/user/customerForgotPassword`;
    return this.http.post<IForgetPasswordResponse>(api, body).pipe(
      take(1),
      catchError(err => { throw err; })
    );
  }

  /**
   * Sends a request to reset the user's password.
   *
   * @param body - Reset password form data containing the new password and token.
   * @returns An observable with the reset password response.
   */
  restPasswordApi(body: IResetPasswordForm): Observable<IResetPasswordResponse> {
    const api = `${this.env.users}/api/user/customerResetPassword`;
    return this.http.post<IResetPasswordResponse>(api, body, {
      headers: {
        passwordResetToken: body.token
      }
    }).pipe(
      take(1),
      catchError(err => { throw err; })
    );
  }

  /**
   * Verifies the validity of a reset password token.
   *
   * @param body - Data containing the reset password token to be verified.
   * @returns An observable with the verification response.
   */
  verifyResetPasswordTokenApi(body: IVerifyResetPasswordToken): Observable<IResetPasswordResponse> {
    const api = `${this.env.users}/api/user/VerifyResetPasswordToken`;
    return this.http.post<IResetPasswordResponse>(api, body).pipe(
      take(1),
      catchError(err => { throw err; })
    );
  }

  /**
   * Initiates external login with Google.
   *
   * @returns An observable with the external login response.
   */
  externalLoginGoogleApi(): Observable<any> {
    const api = "https://flightsearch.bahmantravel.com/api/user/googlelogin";
    return this.http.get<any>(api).pipe(
      take(1),
      catchError(err => { throw err; })
    );
  }

  /**
   * Registers a new user.
   *
   * @param body - Registration form data containing user details.
   * @returns An observable with the registration response.
   */
  registeration(body: IRegisterResponse): Observable<IRegisterResponse> {
    const api = `${this.env.users}/api/user/register`;
    return this.http.post<IRegisterResponse>(api, body).pipe(
      take(1),
      catchError(err => { throw err; })
    );
  }

  /**
   * Verifies an OTP for user authentication or registration.
   *
   * @param body - Data containing the OTP to be verified.
   * @returns An observable with the login response after OTP verification.
   */
  otpVerification(body: IOtp): Observable<ILoginResponse> {
    const api = `${this.env.users}/api/user/verifyOtp`;
    return this.http.post<ILoginResponse>(api, body).pipe(
      take(1),
      catchError(err => { throw err; })
    );
  }
  /**
   * social login request
   *
   * @param body - Login form data containing user credentials returned from google.
   * @returns An observable with the login response, containing user authentication data.
   */
   googleLogin(body: GoogleAuthResponse): Observable<ILoginResponse> {
    const api = `${this.env.users}/api/User/SigninGoogle`;
    return this.http.post<ILoginResponse>(api, body).pipe(
      take(1),
      catchError(err => { throw err; })
    );
  }

  facebookLogin(facebookData: any): Observable<any> {
    return this.http.post(`${this.env.users}/api/User/SigninFacebook`, facebookData);
  }

  /**
   * Resend OTP request
   *
   * @param userEmail - The email of the user to resend the OTP to.
   * @returns An observable with the response.
   */
  resendOtpApi(userEmail: string): Observable<any> {
    const api = `${this.env.users}/api/User/ResendOTP`;
    return this.http.post<any>(api, {}, {
      headers: {
        userEmail: userEmail
      }
    }).pipe(
      take(1),
      catchError(err => { throw err; })
    );
  }
}
