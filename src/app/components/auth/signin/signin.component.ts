import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { UserService } from '../../../services/auth/user.service';
import { SigninModel } from '../../../models/signin-model';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
  loginModel:SigninModel = new SigninModel()
  loginStatus:string = ''
  logoutStatus:string = ''
  resetStatus:string = ''
  lostPass:boolean = false;
  emailValid = false;
  emailReserved = false;

  constructor(
    private authService:AuthService,
    public userService:UserService
    ){}  

    async resetPass(){
      await this.authService.resetPass(this.loginModel.email).then(() => {
        this.resetStatus = 'Email sended, check your mailbox'
      })
      .catch((error) => {
        this.resetStatus = error.message
      })
    }
  
    async validateEmail(value: string) {
      this.emailValid = this.authService.validateEmail(value)
      //Check DBs
      if (this.emailValid) {
        let emailReserved = await this.authService.emailTaken(value);
        if (typeof emailReserved == 'boolean')
          this.emailReserved = emailReserved
        if (emailReserved instanceof Error)
          throw new Error(emailReserved.message)
      }
    }

  async login(){
    try {
      await this.authService.login(this.loginModel)
      this.loginStatus = 'Successful login'
      this.loginModel.pass = '' // Security
    } catch (error:any) {
      //console.error(error)
      const code = error.code
      let message: string = '';
      //https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#error-codes_12
      const availableErrors: { [key: string]: () => string } = {
        'auth/invalid-credential': () => 'Wrong email or password', //available
        'auth/too-many-requests': () => 'Too many failed login attempts, please wait, or reset your password.',
        'auth/invalid-email': () => 'Invalid email', //available
        'auth/user-disabled': () => 'User disabled (banned)', //available
        'auth/user-not-found': () => 'User not found', //not available (email enumeration protection?)
        'auth/wrong-password': () => 'Wrong password', //not available (email enumeration protection?)
        'default': () => error.message
      };
      // Hiba kezelése
      message = ((availableErrors[error.code] || availableErrors['default'])())
      this.loginStatus = message
      this.loginModel.pass = '' // Security
    }
  }
  async logout() {
    try {
      await this.authService.logout()
      this.logoutStatus = 'Logged out'
    } catch (error: any) {
      const code = error.code
      let message: string = '';
      //https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#signout
      const availableErrors: { [key: string]: () => string } = {
        //no error codes
        'default': () => error.message
      };
      message = ((availableErrors[error.code] || availableErrors['default'])())
      this.logoutStatus = message
    }
  }
}
