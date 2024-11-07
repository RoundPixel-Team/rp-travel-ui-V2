import { inject, Injectable } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Subject, Subscription } from "rxjs";
import { USER_DEFAULT } from "../../constants/defaultValues";
import { FIRST_NAME_ERROR_MESSAGES, LAST_NAME_ERROR_MESSAGES, PASSWORD_ERROR_MESSAGES, PHONE_ERROR_MESSAGES } from "../../constants/error-messages";
import { PASSWORD_VALIDATION, PHONE_VALIDATION, REQUIRED_VALIDATION } from "../../constants/validation";
import { IUser } from "../../interfaces";
import { UserProfileApiService } from "./user-profile-api.service";

@Injectable({
  providedIn: 'root',
}) export class UserProfileService {
  fb = inject(FormBuilder);
  
  profileForm: FormGroup = new FormGroup({});
  changePasswordForm: FormGroup = new FormGroup({});

  /**
   * To notify when any change happens in the authentication process such as:
   * - Errors
   * - Successfully Register
   * - Successfully Loged In
   */

  notify: Subject<number> = new Subject();
  subscription: Subscription = new Subscription();
  isLoading: boolean = false;
  user: IUser = USER_DEFAULT;

  userProfileApi = inject(UserProfileApiService)

  /**
   * this function is responsible to initialize the Profile Form
   */
  initProfileForm() {
    this.profileForm = new FormGroup({
      firstName: new FormControl('', REQUIRED_VALIDATION),
      lastName: new FormControl('', REQUIRED_VALIDATION),
      userPhoneNumber: new FormControl('', PHONE_VALIDATION),
    });
  }

  /**
   * this function is responsible to initialize the ChangePassword(sign up) Form
   */
  initChangePasswordForm() {
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl('', PASSWORD_VALIDATION),
      newPassword: new FormControl('', PASSWORD_VALIDATION),
      confirmPassword: new FormControl('', PASSWORD_VALIDATION),
    },
    {
      validators: this.confirmPasswordValidator,
    });
  }

  confirmPasswordValidator(control: AbstractControl) {
    return control.get('newPassword')?.value === control.get('confirmPassword')?.value ? null : {mismatch: true}
  }
 
  /**
   * this function is responsible to make intgeration between front and backend request (USER REGISTER)
   */
  getUserProfile(){
    this.isLoading = true;
    let token = localStorage.getItem('token');

    if(!token){
      this.isLoading = false;
    }
    else{
      token = JSON.parse(token);
      this.subscription.add(
        this.userProfileApi.getUserProfileApi(token!).subscribe({
          next: (res) => {
            this.user = res.returnObject;
            this.isLoading = false;
            this.notify.next(0);
          },
          error: (error:any) => {
            this.isLoading = false;
            this.notify.next(1);
          },
        })
      )
    }
  }
 
  /**
   * this function is responsible to make intgeration between front and backend request (USER REGISTER)
   */
  editUserProfile(){
    this.isLoading = true;
    let token = localStorage.getItem('token');

    if(this.profileForm.invalid || !token){
      this.profileForm.markAllAsTouched()
      this.isLoading = false
    }
    else{
      token = JSON.parse(token);
      this.subscription.add(
        this.userProfileApi.editUserProfileApi(token!, this.profileForm.value).subscribe({
          next: (res) => {
            this.user = res.returnObject;
            this.isLoading = false;
            this.notify.next(2);
          },
          error: (error:any) => {
            this.isLoading = false;
            this.notify.next(1);
          },
        })
      )
    }
  }
 
  /**
   * this function is responsible to make intgeration between front and backend request (USER REGISTER)
   */
  changePassword(){
    this.isLoading = true;
    let token = localStorage.getItem('token');

    if(this.changePasswordForm.invalid || !token){
      this.changePasswordForm.markAllAsTouched()
      this.isLoading = false
    }
    else{
      token = JSON.parse(token);
      this.subscription.add(
        this.userProfileApi.changePasswordApi(token!, this.changePasswordForm.value).subscribe({
          next: (val) => {
            if(val.status === 1) {
              this.isLoading = false;
              this.notify.next(1);
            } else {
              this.isLoading = false;
              this.notify.next(2);
            }
          },
          error: (error:any) => {
            this.isLoading = false;
            this.notify.next(1);
          },
        })
      )
    }
  }

  getFirstNameErrorMessage(firstNameControl: AbstractControl, lang: 'en' | 'ar' = 'en') {
    if (firstNameControl.hasError('required')) {
      return FIRST_NAME_ERROR_MESSAGES.required[lang];
    }
    return '';
  }
  
  getLastNameErrorMessage(lastNameControl: AbstractControl, lang: 'en' | 'ar' = 'en') {
    if (lastNameControl.hasError('required')) {
      return LAST_NAME_ERROR_MESSAGES.required[lang];
    }
    return '';
  }
  
  getPasswordErrorMessage(passwordControl: AbstractControl, lang: 'en' | 'ar' = 'en') {
    if (passwordControl.hasError('required')) {
      return PASSWORD_ERROR_MESSAGES.required[lang];
    }
    if (passwordControl.hasError('minlength')) {
      return PASSWORD_ERROR_MESSAGES.minlength[lang];
    }
    if (passwordControl.hasError('pattern')) {
      return PASSWORD_ERROR_MESSAGES.pattern[lang];
    }
    return '';
  }
  
  getPhoneErrorMessage(phoneControl: AbstractControl, lang: 'en' | 'ar' = 'en') {
    if (phoneControl.hasError('required')) {
      return PHONE_ERROR_MESSAGES.required[lang];
    }
    if (phoneControl.hasError('minlength')) {
      return PHONE_ERROR_MESSAGES.minlength[lang];
    }
    if (phoneControl.hasError('pattern')) {
      return PHONE_ERROR_MESSAGES.pattern[lang];
    }
    return '';
  }
  

  destroyer() {
    this.subscription.unsubscribe();
  }
}
