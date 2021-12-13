import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { ModalController } from '@ionic/angular';
import { NoteService } from 'src/app/services/note.service';
import { Note } from 'src/app/shared/note.interface';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.page.html',
  styleUrls: ['./edit-modal.page.scss'],
})
export class EditModalPage implements OnInit {
  
  @Input() note:Note

  public formNota: FormGroup;
  startButton: boolean;
  stopButton: boolean;
  languages: any [];
  constructor(private modalController:ModalController,private noteS:NoteService, private fb: FormBuilder) { }

  ngOnInit() {
    
    this.formNota = this.fb.group({
      tittle: ["", Validators.required],
      description: [""]
    });
    this.languages = [
      {
        name: "English",
        code: "en-US"
      },
      {
        name: "Spanish",
        code: "es-ES"
      },
      {
        name: "French",
        code: "fr-FR"
      },
      {
        name: "German",
        code: "de-DE"
      }];
  }

  public async editNote(){
    this.note.tittle=this.formNota.get("tittle").value;
    this.note.description=this.formNota.get("description").value;

    await this.noteS.editNote(this.note);

    this.closeModal();
  }

  public closeModal(){
    
    this.modalController.dismiss();
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

  async speakText() {
    await TextToSpeech.speak({
      text: this.note.description,
      lang: "es-ES",
      rate: 0.75
    }).then(() => {
      console.log("Success");
    }).catch((error) => {
      console.error(error);
    });
  }

  async stopText() {
    await TextToSpeech.stop();
  }
    
}
