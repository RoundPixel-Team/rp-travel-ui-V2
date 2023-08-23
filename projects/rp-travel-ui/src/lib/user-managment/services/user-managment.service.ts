import { Inject, Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserManagmentApiService } from './user-managment-api.service';
import { Router } from '@angular/router';

const REG_DATA = 'reg_data';
@Injectable({
  providedIn: 'root',
})
export class UserManagmentService {
  //#region Variablses
  subscription: Subscription = new Subscription();
  api = Inject(UserManagmentApiService) 
  loginForm: FormGroup = new FormGroup({});
  registerForm: FormGroup = new FormGroup({});
  //#endregion

  constructor(private __fb: FormBuilder,private __router: Router) {}
  /**
   * this function is responsible to initialize the Login Form
   */
  initLoginForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl(false, [Validators.required]),
    });
  }
  /**
   * this function is responsible to initialize the Register(sign up) Form
   */
  initRegisterForm() {
    this.registerForm = this.__fb.group( {
      username: ['',  [Validators.required, Validators.pattern('([a-zA-Z]+ +[a-zA-Z]*)*')],],
      mobile: ['', [Validators.required]],
      mail: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            '^[a-z0-9A-Z._%+-]+@[a-z0-9A-Z.-]+\\.[a-zA-Z]{2,4}$'
          ),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      checkBox: [, [Validators.requiredTrue]],
    },
    {
      validators: this.ConfirmPasswordValidator('password', 'confirmPassword'),
    });
  }
  /**
   * this function is responsible to check validation between password and confirm password
   */
  ConfirmPasswordValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      let control = formGroup.controls[controlName];
      let matchingControl = formGroup.controls[matchingControlName];

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ custom: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  /**
   * this function is responsible to make intgeration between front and backend request (USER LOGIN)
   * @params router navigation name to navigate to another page (HOME PAGE) after login
   */
  loginSubmit(routerName:string){
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched()
    }
    else {
      this.subscription.add(
        this.api.login(this.loginForm.value).subscribe((val:any)=>{
          console.log(val);
          this.__router.navigate([`/${routerName}`])     //navigate to paramter name page after login
          window.location.reload();
        })
      );
    }
  }
  /**
   * this function is responsible to make intgeration between front and backend request (USER REGISTER)
   * @params router navigation name to navigate to another page (LOGIN PAGE) after register
  */
  regitserSubmit(routerName:string){
    if(this.registerForm.invalid){
      this.registerForm.markAllAsTouched();
    }
    else{
      this.api(this.registerForm.value).subscribe((val:any)=>{
        localStorage.setItem(REG_DATA,JSON.stringify(this.registerForm.value))
        this.__router.navigate([`/${routerName}`]) //navigate to paramter name page after registerate the account
      },(error:any)=>{
        console.log(error);
      })
    }
  }

  /**
   * this function is responsible to destory any opened subscription on this service
   */
  destroyer() {
    this.subscription.unsubscribe();
  }
}
