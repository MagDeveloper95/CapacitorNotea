import { Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth.service';
import { LocalStorageService } from './services/local-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  private langsAvailable=['es','en'];
  private isAndroid=false;
  constructor(private traductor:TranslateService,
    private storage:LocalStorageService,
    private authS:AuthService,private platform:Platform) {
      this.platform.backButton.subscribeWithPriority(10, () => {
        App.exitApp();
      });
        
      this.isAndroid=this.platform.is("android");
      (async() =>{
        let lang= await storage.getItem("lang");
        if(lang==null){
          lang=this.traductor.getBrowserLang();
        }else{
          lang=lang.lang;
        }
        console.log("SETEANDO "+lang)
        if(this.langsAvailable.indexOf(lang)>-1){
          traductor.setDefaultLang(lang);
        }else{
          traductor.setDefaultLang('en');
        }
      })();  
   
  }
  async ngOnInit() {
    this.platform.ready().then(async ()=>{
      this.isAndroid=this.platform.is("android");
      if(!this.isAndroid)
        await GoogleAuth.init();
      await this.authS.loadSession();
    })
  }
}
