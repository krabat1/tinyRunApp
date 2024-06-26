import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { reauthenticateWithCredential, EmailAuthProvider, User } from "firebase/auth";
import { SignupModel } from '../../models/signup-model';
//import { RegisterModel } from './register-model';
import { SigninModel } from '../../models/signin-model';
//import { LoginModel } from './login-model';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { RealtimeService } from '../../services/db/realtime.service';
import { FirestoreService } from '../../services/db/firestore.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  mailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  passRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-_]).{8,}$/
  displayNameRegex = /^([a-zA-Z])([a-zA-Z0-9_-]){0,17}([a-zA-Z0-9])$/

  constructor(
    private afAuth: AngularFireAuth,
    private userService: UserService,
    private router: Router,
    private firestoreService:FirestoreService,
    private realtimeService:RealtimeService) {
    this.getCurrentUser()
  }

/* Methods in order (! - not exists)
 *
 * getCurrentUser   check user sign-in state
 * ---------------- login component
 * login
 * logout
 * send password reset mail
 * ---------------- register component
 * register
 * validateEmail
 * emailTaken
 * !third-party registration
 * ---------------- account component
 * reAuthenticate
 * delete
 * set displayName
 * check displayName during set displayName
 * !change email
 * !check email during change email
 * SendVerificationMail
 * !change password when loggen in ???
 * !integrate gravatar for user contact data
 * !upload image
 * !public user page
 */


  getCurrentUser() {
    this.afAuth.onAuthStateChanged((user) => {
      //Adds an observer for changes to the user's sign-in state.
      //the observer is only triggered on sign-in or sign-out.
      if (user) {
        this.userService.user = user
        this.userService.loggedIn = true
        //this.router.navigate(['/logout'])
      } else {
        this.userService.user = null
        this.userService.loggedIn = false
        //this.router.navigate([''])
      }
    });
  }

  login(loginModel:SigninModel) {
    return this.afAuth.signInWithEmailAndPassword(loginModel.email,loginModel.pass)
      .then((userCredential) => {
        // Success
        //this.router.navigate(['/logout'])
      })
      .catch((error) => {
        throw error
      });
  }

  logout() {
    return this.afAuth.signOut()
      .then((userCredential) => {
        // Sikeres kijelentkezés
        //this.router.navigate(['/login'])
      })
      .catch((error) => {
        // Hiba kezelése
        //console.error('Kijelentkezési hiba:', error);
        throw error
      });
  }

  resetPass(email:string): Promise<void | Error>{
    return this.afAuth.sendPasswordResetEmail(email)
    .then(() => {
      // Sikeres visszaállítási e-mail küldés
    })
    .catch((error) => {
      let err =  error as { code: string, message: string }
      console.log(err.code)
      if(err.code == 'auth/invalid-email'){
        return new Error('Invalid email');
      }else if(err.code == 'auth/user-not-found'){
        return new Error('User not found'); // <-- not work
      }else{
        return new Error(err.message)
      }
    });
  }

  register(registerModel: SignupModel) {
    return this.afAuth.createUserWithEmailAndPassword(registerModel.email, registerModel.pass)
      .then((userCredential) => {
        // Success
        if (userCredential.user !== null) {
          //this.firestoreService.addUser(userCredential.user.uid, userCredential.user.email as string)
          //this.realtimeService.addUser(userCredential.user.uid, userCredential.user.email as string)
          this.firestoreService.setCollectionDocData('users',userCredential.user.uid, {email:userCredential.user.email as string})
          this.realtimeService.setListIdData('users',userCredential.user.uid, {email:userCredential.user.email as string})
        }
      })
      .catch((error) => {
        throw error
      });
  }

  validateEmail(value: string) {
    if (value.length > 0) {
      let matchArray = value.match(this.mailRegex) as Array<string>;
      return matchArray === null ? false : true;
    } else {
      return false
    }
  }

  // check email exist on the registration process
  async emailTaken(email: string): Promise<boolean | Error> {
    try {
      //const firestore = await this.firestoreService.emailTaken(email);
      //const realtime = await this.realtimeService.emailTaken(email);
      const firestore = await this.firestoreService.checkCollectionPropertyValueBoolean('users','email',email)
      const realtime = await this.realtimeService.checkListPropertyValueBoolean('users','email',email)
      if (firestore && realtime) {
        return true;
      } else if (!firestore && !realtime) {
        return false;
      } else {
        throw new Error('The email address exists in only one database');
      }
    } catch (error) {
      throw error
    }
  }


  reAuthenticate(loginModel:SigninModel): Promise<User | null> {
    return this.afAuth.currentUser.then(user => {
      if (user) {
        const credential = EmailAuthProvider.credential(loginModel.email,loginModel.pass);
        return reauthenticateWithCredential(user, credential)
          .then(() => {
            //console.log('reauthentication ok');
            return user as User; 
          })
          .catch((error) => {
            //console.error('Reautentication error: ', error);
            throw error; 
          });
      } else {
        return null; 
      }
    });
  }


  delete(user: User) {
    let uid = user.uid;
    return Promise.all([
       // !! Realtime DB rules cooperate with the rules of Realtime DB SDK !!
      this.realtimeService.deleteListNode('users', uid),
      this.firestoreService.deleteDocument('users', uid)
    ]).then(() => {
      // Sikeres törlés
      return user.delete(); // Delete user from Firebase Authentication
    }).catch((error) => {
      throw error;
    });
  }

  setDisplayName(displayName: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.afAuth.currentUser
        .then((user) => {
          console.log(user)
          if (user) {
            this.firestoreService.setCollectionDocData('users', this.userService.user.uid, { displayNameLow: displayName.toLowerCase() })
            this.realtimeService.setListIdData('users', this.userService.user.uid, { displayNameLow: displayName.toLowerCase() })
            if (this.userService.user.displayName !== displayName) {
              user.updateProfile({
                displayName: displayName
              })
              this.userService.user = user
              return Promise.resolve();
            }else{
              return Promise.reject();
            }
          }else{
            return Promise.reject();
          }
        })
        .catch((error) => {
          return Promise.reject(error);
        })
    })
  }

  // check display name exists when set or change it
  async displayNameTaken(displayName: string) {
    try {
      const firestore = await this.firestoreService.checkCollectionPropertyValueBoolean('users', 'displayNameLow', displayName.toLowerCase())
      const realtime = await this.realtimeService.checkListPropertyValueBoolean('users', 'displayNameLow', displayName.toLowerCase())
      if (firestore && realtime) {
        return true;
      } else if (!firestore && !realtime) {
        return false;
      } else {
        throw new Error('The email address exists in only one database');
      }
    } catch (error) {
      throw error
    }
  }

  SendVerificationMail() {
    try {
      return this.afAuth.currentUser.then((user: any) => {
        return user.sendEmailVerification().then(() => {
          return Promise.resolve();
        });
      });
    } catch (error:any) {
      return Promise.reject(error);
    }
  }

  changePassword(newPass: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.afAuth.currentUser
        .then((user) => {
          console.log(user)
          if (user !== null) {
            return user.updatePassword(newPass).then(() => {
              return Promise.resolve();
            });
          }else{
            return Promise.reject();
          }
        })
        .catch((error) => {
          return Promise.reject(error);
        })
    })
  }
}