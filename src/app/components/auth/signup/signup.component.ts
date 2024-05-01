import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { SignupModel } from '../../../models/signup-model';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})

export class SignupComponent {
  registerModel:SignupModel = new SignupModel()
  registerStatus:string = ''
  passAgain:string = ''
  emailIsValid:boolean = false
  passIsValid:boolean = false
  passAgainIsValid:boolean = false

  emailReserved:boolean|Error = true
  emailReservedMessage:string = ''

  constructor(private authService:AuthService){}  

  async register() {
    try {
      await this.authService.register(this.registerModel)
      this.registerStatus = 'Successful registration'
      this.registerModel.pass = '' // Security
    } catch (error: any) {
      const code = error.code
      let message: string = '';
      //https://firebase.google.com/docs/reference/js/v8/firebase.auth.Auth#error-codes_3
      const availableErrors: { [key: string]: () => string } = {
        'auth/email-already-in-use': () => 'Email already exist',
        'auth/invalid-email': () => 'Invalid email',
        'auth/operation-not-allowed': () => 'Registation mode not allowed',
        'auth/weak-password': () => 'Weak password',
        'default': () => error.message
      };
      // Hiba kezelése
      message = ((availableErrors[error.code] || availableErrors['default'])())
      this.registerStatus = message
      this.registerModel.pass = '' // Security
    }
  }

  async validateEmail(value: string) {
    this.emailIsValid = this.authService.validateEmail(value)
    //Check DBs
    if (this.emailIsValid) {
      let emailReserved = await this.authService.emailTaken(value);
      if (typeof emailReserved == 'boolean')
        this.emailReserved = emailReserved
        this.emailReserved ? this.emailReservedMessage = '⛔️ Reserved!' : this.emailReservedMessage = '✅ Free!';
      if (emailReserved instanceof Error)
        throw new Error(emailReserved.message)
    }
  }

  validatePass(value: string){
    if (value.length > 0) {
      let matchArray = value.match(this.authService.passRegex) as Array<string>;
      matchArray === null ? this.passIsValid = false : this.passIsValid = true;
    } else {
      this.passIsValid = false
    }
  }

  validatePassAgain(value: string) {
    let length: boolean = value.length > 0 ? true : false;
    let same: boolean = value == this.registerModel.pass ? true : false;
    this.passAgainIsValid = length && same && this.passIsValid ? true : false;
  }
}
