import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource, ImageOptions, Photo } from '@capacitor/camera';
import { IonToggle } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { LocalStorageService } from '../services/local-storage.service';
import { Note } from '../shared/note.interface';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  @ViewChild('mitoggle', { static: false }) mitoogle: IonToggle;
  public image: any;


  constructor(private traductor: TranslateService, private storage:LocalStorageService, private authS: AuthService,private router:Router) {
    /*traductor.setDefaultLang("es");
    traductor.get("PHOTOS").toPromise().then(data=>{
      console.log(data);
    })*/
  }
  /**
  ionViewDidEnter() {
    const lang = this.traductor.getDefaultLang();
    if (lang == 'es') {
      this.mitoogle.checked = false;
    } else {
      this.mitoogle.checked = true;
    }
  }*/

  public async hazFoto() {
    let options: ImageOptions = {
      resultType: CameraResultType.Uri,
      allowEditing: false,
      quality: 90,
      source: CameraSource.Camera
    }

    let result: Photo = await Camera.getPhoto(options);
    this.image = result.webPath;
  }
  
  public async cambiaIdioma(event) {
    if (event && event.detail && event.detail.checked) {
      await this.storage.setItem('lang',{value:'en'});
      this.traductor.use('en');
    } else {
      await this.storage.setItem('lang',{value:'es'});
      this.traductor.use('es');
    }
  }
  public async closeSession() {
    await this.authS.logout();
    this.router.navigate(['']);
  }

}
