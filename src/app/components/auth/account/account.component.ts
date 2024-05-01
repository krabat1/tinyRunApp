import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { User } from '@angular/fire/auth';
//import { LoginModel } from '../login-model';
import { SigninModel } from '../../../models/signin-model';
import { UserService } from '../../../services/auth/user.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: '0', transform: 'scaleY(0%)', maxHeight: '0px'}),
        animate('125ms 250ms ease-in', style({ maxHeight: '300px', transform: 'scaleY(100%)' })),
        animate('125ms linear', style({ opacity: '1' })),
      ]),
      transition(":leave", [
        animate('125ms linear', style({ opacity: '0' })),
        animate('125ms ease-out', style({ maxHeight: '0px', transform: 'scaleY(0%)' })),
      ])
    ])
  ]
})
export class AccountComponent {
  selected: string = ''
  loginModel: SigninModel = new SigninModel()
  reauthStatus: string = ''
  deleteStatus: string = ''
  sendVerificationStatus: string = ''
  newDisplayName: string = ''
  displayNameValid: boolean = false
  displayNameExists: boolean = true
  displayNameExistsStatus: string = ''
  changeDisplayNameStatus: string = ''

  newPass: string = ''
  newPassValid:boolean = false
  newPassAgain: string = ''
  newPassAgainValid:boolean = false
  changePasswordStatus: string = ''

  constructor(private authService: AuthService, public userService: UserService) {}

  select(value: string) {
    this.selected = value;
    this.reauthStatus = '';
  }

  setDisplayName() {
    this.authService.setDisplayName(this.newDisplayName)
      .then(() => {

      }).catch((error) => {
        throw error
      })
  }

  async changePassword() {
    if((this.loginModel.pass !== this.newPass) && (this.newPass === this.newPassAgain) && this.newPassValid) {
      this.loginModel.email = this.userService.user.email
      await this.authService.reAuthenticate(this.loginModel)
      .then((user) => {
        try {
          this.authService.changePassword(this.newPass)
          this.changePasswordStatus = 'Password changed'
        } catch (error:any) {
          const code = error.code
          let message: string = '';
          const availableErrors: { [key: string]: () => string } = {
            'auth/weak-password': () => 'Weak password',
            'auth/requires-recent-login': () => 'Please log in again',
            'default': () => error.message
          };
          message = ((availableErrors[error.code] || availableErrors['default'])())
          this.changePasswordStatus = message
        }
      })
      .catch((error) => {
          let message = this.reauthenticationErrorHandling(error)
          this.reauthStatus = message
      })
      .finally(() => {
        this.loginModel.pass = '' 
        this.newPass = '' 
        this.newPassAgain = '' // Security
      })
    }else if(this.loginModel.pass === this.newPass){
      this.changePasswordStatus = 'New password cannot be the same as old password'
    }else if(this.newPass !== this.newPassAgain){
      this.changePasswordStatus = 'Passwords do not match at new password'
    }
  }

  validatePass(value: string){ 
    if (value.length > 0) {
      let matchArray = value.match(this.authService.passRegex) as Array<string>;
      matchArray === null ? this.newPassValid = false : this.newPassValid = true;
    } else {
      this.newPassValid = false
    }
  }

  validatePassAgain(value: string) { 
    let length: boolean = value.length > 0 ? true : false;
    let same: boolean = value == this.newPass ? true : false;
    this.newPassAgainValid = length && same && this.newPassValid ? true : false;
  }

  async validateDisplayName(value:string){
    if (value.length > 0) {
      value.match(this.authService.displayNameRegex) ? this.displayNameValid = true : this.displayNameValid = false;
    }
    if (this.displayNameValid === true) {
      //console.log('check exists' + value)
      try {
        const response = await this.authService.displayNameTaken(value)
        //console.log('>>' + response)
        response === true ? this.displayNameExistsStatus = '⛔️ Reserved!' : this.displayNameExistsStatus = '✅ Free!';
        this.displayNameExists = response
      } catch (error) {
        throw error
      }
    }else{
      this.displayNameExistsStatus = ''
    }
  }

  async sendVerificationMail() {
    if (this.loginModel.pass == '') {
      this.sendVerificationStatus = 'Password required'
    } else {
      this.sendVerificationStatus = ''
      this.loginModel.email = this.userService.user.email
      await this.authService.reAuthenticate(this.loginModel)
        .then((user) => {
          this.reauthStatus = 'Reauthentication successful'
          try {
            this.authService.SendVerificationMail()
            this.sendVerificationStatus = 'Verification email sended, check your inbox'
          } catch (error: any) {
            const code = error.code
            let message: string = '';
            const availableErrors: { [key: string]: () => string } = {
              'auth/missing-android-pkg-name': () => 'An Android package name must be provided if the Android app is required to be installed.',
              'auth/missing-continue-uri': () => 'A continue URL must be provided in the request.',
              'auth/missing-ios-bundle-id': () => 'An iOS bundle ID must be provided if an App Store ID is provided.',
              'auth/invalid-continue-uri': () => ' The continue URL provided in the request is invalid.',
              'auth/unauthorized-continue-uri': () => 'The domain of the continue URL is not whitelisted. Whitelist the domain in the Firebase console.',
              'default': () => error.message
            };
            message = ((availableErrors[error.code] || availableErrors['default'])())
            this.sendVerificationStatus = message
          }
        })
        .catch((error) => {
          let message = this.reauthenticationErrorHandling(error)
          this.reauthStatus = message
        })
        .finally(() => {
          this.loginModel.pass = '' // Security
        })
    }
  }


  async delete() {
    if (this.loginModel.pass == '') {
      this.reauthStatus = 'Password required'
    } else {
      this.reauthStatus = ''
      this.loginModel.email = this.userService.user.email
      await this.authService.reAuthenticate(this.loginModel)
        .then((user) => {
          if (user) {
            let email = user.email
            this.reauthStatus = 'Reauthentication successful'
            try {
              this.authService.delete(user)
              console.log('user deleted ' + email)
              this.deleteStatus = 'User deleted'
            } catch (error: any) {
              const code = error.code
              let message: string = '';
              //https://firebase.google.com/docs/reference/js/v8/firebase.User#error-codes
              const availableErrors: { [key: string]: () => string } = {
                'auth/requires-recent-login': () => 'Reauthentication needed',
                'default': () => error.message
              };
              message = ((availableErrors[error.code] || availableErrors['default'])())
              this.deleteStatus = message
            }
          }
        })
        .catch((error) => {
          let message = this.reauthenticationErrorHandling(error)
          this.reauthStatus = message
        })
        .finally(() => {
          this.loginModel.pass = '' // Security
        })
    }
  }

  //reauthentikációs hibakezelés kiszervezése
  reauthenticationErrorHandling(error: any): string {
    const code = error.code
    let message: string = '';
    //https://firebase.google.com/docs/reference/js/v8/firebase.User#error-codes_7
    const availableErrors: { [key: string]: () => string } = {
      'auth/user-mismatch': () => 'The given credentials does not correspond to Yours.',
      'auth/user-not-found': () => 'User not found',
      'auth/invalid-credential': () => 'Invalid credential',
      'auth/invalid-email': () => 'Invalid email',
      'auth/wrong-password': () => 'Wrong password',
      'auth/invalid-verification-code': () => 'Invalid verification code',
      'auth/invalid-verification-id': () => 'Invalid verification-ID',
      'default': () => error.message
    };
    message = ((availableErrors[error.code] || availableErrors['default'])())
    return message as string
  }
}
