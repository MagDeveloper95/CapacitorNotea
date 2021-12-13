import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { Note } from '../shared/note.interface';
import { NoteService } from '../services/note.service';
import { SpeechRecognition } from "@capacitor-community/speech-recognition";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {


  public startButton: boolean = false;
  public stopButton: boolean = true;
  public formNota: FormGroup;
  public miLoading: HTMLIonLoadingElement;
  public miToast: HTMLIonToastElement;

  constructor(private fb: FormBuilder, private noteService: NoteService, public loadingController: LoadingController, public toastController: ToastController) { }

  async ngOnInit() {
    // debe cargarse en el oninit
    this.formNota = this.fb.group({
      tittle: ["", Validators.required],
      description: [""]
    });
      //Methor for inizialize the plugin
      await SpeechRecognition.available().then((data) => {
      console.log("available: " + data.available);
      });
      //Method for check if we have permission to use the plugin
      SpeechRecognition.hasPermission().then((data) => {
        if (!data.permission) {
          //if we dont have permission to use the plugin, we ask for it
          SpeechRecognition.requestPermission();
          console.log("He pedido persmiso");
        }
      })
  
      await SpeechRecognition.available().then((data) => {
        console.log("available: " + data.available);
      })
  }

  async presentLoading() {
    this.miLoading = await this.loadingController.create({
      message: '',
    });
    await this.miLoading.present();
  }

  async presentToast(msg: string, clr: string) {
    this.miToast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: clr
    });
    this.miToast.present();
  }

  public async addNote() {
    let newNote: Note = {
      tittle: this.formNota.get("tittle").value,
      description: this.formNota.get("description").value
    }
    await this.presentLoading();
    try {
      await this.noteService.addNote(newNote);
      await this.presentToast("Nota agrageda Correctamente", "success");
      this.formNota.reset();
    } catch (error) {
      console.log(error);
      await this.presentToast("Ha ocurrido un error", "danger");
    } finally {
      //te ahorras el if -> se ejecuta solo si lo primero no es null o sease true
      this.miLoading && this.miLoading.dismiss();
    }

  }

 
  async speak() {
    this.startButton = true;
    this.stopButton = false;
    //Start the recognition
    await SpeechRecognition.start({
      //different characteristics of the plugin
      language: "es-ES",  
      maxResults: 2,
      prompt: "Di algo",
      partialResults: true,
    }).then(async (data) => {
      let titulo = this.formNota.get("tittle").value;
      this.formNota.setValue({
        tittle: titulo,
        description: data.matches[0].charAt(0).toUpperCase() + data.matches[0].slice(1)
      });
      data.matches.forEach(data =>{
        console.log("coincidencia: "+data);
      })
    }).catch((data) => {
      console.error(data);
    })
  }

  async stop() {
    SpeechRecognition.stop();
    this.startButton = false;
    this.stopButton = true;
  }
}
