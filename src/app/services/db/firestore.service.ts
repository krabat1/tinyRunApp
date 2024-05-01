import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) { }

  /* auth.service -> delete() */
  //delete a <doc> from a <collection>
  deleteDocument(collection: string, doc: string): Promise<void> {
    return this.firestore.collection(collection).doc(doc).delete()
    .then(()=>{
      // success
    })
    .catch((error)=>{
      throw error
    })
  }

  /* auth.service -> register() */
  //set a specific <data> in a <doc> within <collection>, with merge
  setCollectionDocData(collection: string, doc: string, data: object): Promise<void> {
    return this.firestore.collection(collection).doc(doc).set(data, { merge: true })
      .then(() => {
        console.log(`set ${collection}Collection ${doc}Doc to ${JSON.stringify(data)}Data`);
      })
      .catch((error) => {
        throw error;
      });
  }
  /*addUser(uid: string, email: string): Promise<void> {
    return this.firestore.collection('users').doc(uid).set({ email: email })
      .then(() => {
        console.log('user added to firestore');
      })
      .catch((error) => {
        throw error;
      });
  }*/

  /* auth.service ->  emailTaken() */
  //check that a <field> exists with a specific <value> in a <collection> and return a boolean
  async checkCollectionPropertyValueBoolean(collection: string, field: string, value: any): Promise<boolean> {
    try {
      const snapshot = await firstValueFrom(this.firestore.collection(collection, ref => ref.where(field, '==', value)).get());
      return !snapshot.empty;
    } catch (error) {
      throw error;
    }
  }
  /*async emailTaken(email: string): Promise<boolean> {
    try {
      const snapshot = await firstValueFrom(this.firestore.collection('users', ref => ref.where('email', '==', email)).get());
      return !snapshot.empty; // The email address exists if the query result is not empty
    } catch (error) {
      throw error;
    }
  }*/
}
