import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.page.html',
  styleUrls: ['./recovery.page.scss'],
})
export class RecoveryPage {
  
  constructor(private authS: AuthService,
    private router: Router,
    private toastController: ToastController
  ) { }

  public async onResetPassword(email) {
    try {
    console.log(email.value);
     await this.authS.resetPassword(email.value);
     this.presentToast('Se ha enviado un correo para restablecer su contraseña');
     this.router.navigate(['']);
    } catch (error) {
      this.presentToast(error.message);
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