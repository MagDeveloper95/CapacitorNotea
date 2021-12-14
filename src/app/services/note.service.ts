import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import * as firebase from 'firebase/compat';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Note } from '../shared/note.interface';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private last:any=null;
  private myCollection: AngularFirestoreCollection;
  private myCollectionString: string;

  constructor(private db: AngularFirestore, private authS: AuthService) {
    this.myCollection = db.collection<any>(environment.firebaseConfig.todoCollection);
  }
  /**
   * Metodo que guarda una nota en la base de datos
   * @param note parametro de tipo Note
   * @returns devuelve una promesa con el resultado.
   */
  public addNote(note: Note): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        let response: DocumentReference<firebase.default.firestore.DocumentData> = await this.myCollection.add({
          tittle:note.tittle,
          description:note.description
        });
        resolve(response.id)
      } catch (error) {
        reject(error);
      }
    });
  }
  /**
   *  Metodo que obtiene todas las notas de la base de datos.
   * @returns devuelve una lista de notas
   */
  public getNotes(): Observable<Note[]> {
    return new Observable((observer) => {
      let result: Note[] = [];
      this.myCollection.get().subscribe((data: firebase.default.firestore.QuerySnapshot<firebase.default.firestore.DocumentData>) => {
        data.docs.forEach((d: firebase.default.firestore.DocumentData) => {
          let tmp = d.data(); //devuelve el objeto almacenado -> la nota con tittle
          let id = d.id;      //devuelve la key del objeto
          result.push({ 'key': id, ...tmp });
          //operador spread -> 'tittle':tmp.tittle,'description':tmp.description
        })
        observer.next(result); // -> esto es lo que devolvemos
        observer.complete();
      })  //final del substcribe
    }); //final del return observable
  }
  /**
   *  Metodo que obtiene una nota de la base de datos.
   * @param id parametro de tipo string que contiene la key de la nota
   * @returns devuelve una nota
   */
  public getNote(id: string): Promise<Note> {
    return new Promise(async (resolve, reject) => {
      let note: Note = null;
      try {
        let result: firebase.default.firestore.DocumentData = await this.myCollection.doc(id).get().toPromise();
        note = {
          id: result.id,
          ...result.data()
        }
        resolve(note);
      } catch (err) {
        reject(err);
      }
    })
  }
  /**
   * Metodo que actualiza una nota de la base de datos.
   * @param id parametro de tipo string que contiene la key de la nota
   * @returns devuelve una promesa con el resultado.
   */
  public remove(id:string):Promise<void>{
    return this.myCollection.doc(id).delete();
  }
  /**
   * Metodo que actualiza una nota de la base de datos.
   * @param nota parametro de tipo Note
   */
   public async editNote(nota:Note):Promise<void>{  
    try{
      let data:Partial<firebase.default.firestore.DocumentData>={
        title:nota.tittle,
        description:nota.description
      };
      await this.myCollection.doc(nota.key).update(data);
    }catch(err){
      console.error(err);
    }
  }
  public getNotesByPage(all?):Observable<Note[]> {
    if(all){
      this.last=null;
    }
    return new Observable((observer) => {
      let result: Note[] = [];
      let query=null;
      if(this.last){
        query=this.db.collection<any>(this.myCollectionString,
          ref => ref.limit(11).startAfter(this.last));
      }else{
        query=this.db.collection<any>(this.myCollectionString,
          ref => ref.limit(11));
      }

        query.get()
        .subscribe(
          (data: firebase.default.firestore.QuerySnapshot<firebase.default.firestore.DocumentData>) => {
            data.docs.forEach((d: firebase.default.firestore.DocumentData) => {
              this.last=d;
              let tmp = d.data(); //devuelve el objeto almacenado -> la nota con title y description
              let id = d.id; //devuelve la key del objeto
              result.push({ 'key': id, ...tmp });
              //operador spread-> 'title':tmp.title,'description':tmp.description
            })
            observer.next(result);  ///este es el return del observable que devolvemos
            observer.complete();
          }) //final del subscribe
    }); //final del return observable
  }
  public async setUserInfo() {
    if (this.authS.user != null) {
      this.myCollection = this.db.collection<any>(this.authS.user.email);
      this.myCollectionString = this.authS.user.email;
    } else {
      this.myCollection = this.db.collection<any>(environment.firebaseConfig.todoCollection);
      this.myCollectionString = environment.firebaseConfig.todoCollection;
    }
  }
}