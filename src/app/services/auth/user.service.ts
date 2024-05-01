import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  loggedIn:boolean = false;
  private _user = new BehaviorSubject<any>(null);
  user$ = this._user.asObservable();

  constructor() { }

  get user(): any {
    return this._user.value;
  }

  set user(newUser: any) {
    this._user.next(newUser);
  }

  userSubscription = this.user$.subscribe((user) => {
    // it can be handled here if the value of user$ has changed

    // The user's login status is monitored by the onAuthStateChanged 
    // method in the getCurrentUser method [AuthService] (and only that),
    // so the loggedIn property is set to the correct value there.
    
    //if( user !== null ){
    //  this.user.email === undefined ? this.loggedIn = false : this.loggedIn = true
    //}
  });
}
