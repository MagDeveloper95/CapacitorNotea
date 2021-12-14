import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/user';
import { ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';




@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})

export class RegisterPage implements OnInit {
  userdata: any;
  constructor(private autService: AuthService,
    private router: Router,private toastController:ToastController) { }

  ngOnInit() {
  }
  /**
   * Metodo para registrar a un usuario en firesbase
   */

  public async onRegister(email,password){
    try{
    const user = await this.autService.register(email.value,password.value);
    if(user){
      await this.autService.sendVerificationEmail();
      this. presentToast('Verifica tu correo para activar tu cuenta');
      console.log(user);
      await this.autService.keepSession();
      
    }
    }catch(error){
      console.log(error);
    }
  }
  //toast message
  public async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

}
