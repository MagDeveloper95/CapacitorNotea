import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/user';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public userinfo:User;
  private isAndroid:boolean;
  constructor(private platform:Platform,
    private authS:AuthService,
    private router:Router) {
  }

  ngOnInit() {
    if(this.authS.isLogged()){
      this.router.navigate(['private/tabs/tab1']);
    }
  }

  ionViewWillEnter(){
    if(this.authS.isLogged){
      this.router.navigate(['private/tabs/tab1']);
    }

   
  }
  public async signinWithGoogle() {
    try {
      await this.authS.loginWithGoogle();
      this.router.navigate(['private/tabs/tab1']);
    } catch (err) {
      console.error(err);
    }
  }

  public recovery(){
    this.router.navigate(['/recovery']);
  }
  public register(){
    this.router.navigate(['/register']);
  }
  public async logIn(email, password) {
    await this.authS.login(email.value, password.value); 
    this.router.navigate(['private/tabs/tab1']);
  }
}