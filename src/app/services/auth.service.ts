import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/user';
import { Platform } from '@ionic/angular';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: any;
  public userdata: User;

  constructor(private storage:LocalStorageService,
    private platform:Platform,public afAuth: AngularFireAuth, private afs: AngularFirestore) { }
  
  /**
   * Metodo que ser encarga de cargar la sesion
   * del usuario si este existe dentro del registro de la aplicacion
   */
  public async loadSession(){
    try {
      let user= await this.storage.getItem('user');
      if(user){
        user=JSON.parse(user);
        this.user=user;
      }
    } catch (error) {
      console.log("Error al cargar sesion ---> "+error);
    }
  }
  /**
   * Metodo de autenticacion con google @codetrix-studio
   */
  public async loginWithGoogle(){
    try {
      let user:User = await GoogleAuth.signIn();
      this.user=user;
      await this.keepSession();
    } catch (error) {
      console.log("Error al iniciar sesion ---> "+error);
    }
  }
  /**
   * Metodo que sera encargado de cerrar la sesion del usuario,
   * removiendo al mismo de la base de datos y eliminando la 
   * sesion del dispositivo
   */
  public async logout(){
    //logout with google or email
    try {
      await this.afAuth.signOut();
      await this.storage.removeItem('user');
    this.user=null;
    } catch (error) {
      console.log("Error al cerrar sesion ---> "+error);
    }
  }
  /**
   * Metodo que se encarga de guardar la sesion del usuario
   */
  public async keepSession(){
    try {
      await this.storage.setItem('user',JSON.stringify(this.user));
    } catch (error) {
      console.log("Error al guardar sesion ---> "+error);
    }
  }
  /**
   * Metodo que se encarga de validar si el usuario esta autenticado
   * @returns Devuelve si el usuario actualmente logueado
   */
  public isLogged():boolean{
    if(this.user) return true; else return false;
  }
  /**
   * Metodo que se encarga de registrar un usuario en firebase con email y conytraseña
   * @param email Email del usuario
   * @param password Contraseña del usuario
   */
  public async register(email:string,password:string){
    try {
      const {user} = await this.afAuth.createUserWithEmailAndPassword(email,password);
      await this.sendVerificationEmail();
      return user;
    } catch (error) {
      console.log("Error al registrar usuario ---> "+error);
    }
  }
  /**
   * Metodo que se encarga de iniciar sesion con email y contraseña
   * @param email Email del usuario
   * @param password Contraseña del usuario
   * @returns Devuelve si el usuario se pudo loguear
   */
  public async login(email:string,password:string):Promise<User>{
    try {
      const {user} = await this.afAuth.signInWithEmailAndPassword(email,password);
      this.user=user;
      await this.keepSession();
      return user;
    } catch (error) {
      console.log("Error al iniciar sesion ---> "+error);
    }
  }
  /**
   * Metodo que se encarga de enviar un correo de verificacion al usuario
   * @returns envio de correo de verificacion
   */
  public async sendVerificationEmail(): Promise<void>{
    try {
      return (await this.afAuth.currentUser).sendEmailVerification();
    } catch (error) {
      console.log("Error al enviar email de verificacion ---> "+error);
    }
  }
  /**
   * Metodo que devuelve si el email del usuario esta verificado
   * @param user verificar si el email del usuario esta verificado
   * @returns 
   */
  public isEmailVerified(user:User): boolean{
    try {
      return user.emailVerified === true ? true : false;
    } catch (error) {
      console.log("Error al verificar email ---> "+error);
    }
  }

  /**
   * Metodo que se encarga de cambiar la contraseña del usuario
   * @param email Email del usuario
   */
  public async resetPassword(email:string): Promise<void>{
    try {
      return await this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log("Error al enviar email de verificacion ---> "+error);
    }
  }

}

  
  
