import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map,take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealtimeService {

  constructor(private db: AngularFireDatabase) { }

  /* auth.service -> delete() */
  //delete a <node> from a <list>
  deleteListNode(list: string, node: string): Promise<void> {
    return this.db.object(`/${list}/${node}`).remove()
    .then(()=>{
      //success
    })
    .catch((error)=>{
      throw Error
    })
  }

  /* auth.service -> register() */
  //set a specific <data> in a <id> within <list>, with manual merge
  setListIdData(list: string, id: string, data: object) {
    const ref = this.db.object(`/${list}/${id}`);
    ref.valueChanges()
    .pipe(
      take(1) // only take one snapshot
    ).subscribe((getdata: any) => {
      const updatedData = { ...getdata, ...data }; // merge existing data with new data
      ref.set(updatedData)
        .then(() => {
          console.log(`set ${list}List ${id}Id ${JSON.stringify(data)}Data`);
        })
        .catch((error) => {
          throw error;
        });
    });
  }
  /*addUser(uid: string, email: string): Promise<void> {
    return this.db.object(`/users/${uid}`).set({ email: email })
      .then(() => {
        console.log('user added to realtime')
      }).catch((error) => {
        throw error;
      })
  }*/

  /* auth.service ->  emailTaken() */
  //check that a <property> exist with specific <value> exist in <list> and return a boolean
  checkListPropertyValueBoolean(list: string, property: string, value: any): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.db.list(list, ref => ref.orderByChild(property).equalTo(value))
        .snapshotChanges()
        .subscribe({
          next: (changes) => {
            // Ha van találat, a changes tömb hossza nem nulla
            resolve(changes.length !== 0);
          },
          error: (error) => {
            reject(error);
          }
        });
    });
  }
  /*emailTaken(email: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.db.list('/users', ref => ref.orderByChild('email').equalTo(email))
        .snapshotChanges()
        .pipe(
          map(changes => !!changes.length)
        )
        .subscribe({
          // https://rxjs.dev/deprecations/subscribe-arguments
          // https://stackoverflow.com/a/71099295/4279940
          // (exists: boolean) => resolve(exists),
          // (error) => reject(error)
             next: (exists: boolean) => resolve(exists),
             error: (error) => reject(error)
        });
    });
  }*/
}
