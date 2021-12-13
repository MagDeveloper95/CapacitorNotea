import { Component, ViewChild } from '@angular/core';
import {
  AlertController,
  IonInfiniteScroll,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { toastController } from '@ionic/core';
import { Note } from '../shared/note.interface';
import { NoteService } from '../services/note.service';
import { ModalController } from '@ionic/angular';
//Cargamos la página modal
import { EditModalPage } from '../pages/edit-modal/edit-modal.page';
import { User } from '@codetrix-studio/capacitor-google-auth/dist/esm/user';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  @ViewChild(IonInfiniteScroll) infinite: IonInfiniteScroll;
  public searchedItem: any;
  public notas: Note[] = [];
  public miLoading: HTMLIonLoadingElement;
  User: User;
  constructor(
    private ns: NoteService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private modalC: ModalController,
    public alertController: AlertController
  ) {}

  async ionViewDidEnter() {
    await this.cargaNotas();
  }
  public async cargaNotas(event?) {
    if (this.infinite) {
      this.infinite.disabled = false;
    }

    if (!event) {
      await this.presentLoading();
    }
    this.notas = [];
    try {
      this.notas = await this.ns.getNotesByPage('algo').toPromise();
    } catch (err) {
      console.log(err);
      //notificar un error al usuario, se puede hacer el loading en un servicio para que no se pisen
      //si se muestran dos loading y se cierra, solo se cierra el último, son independientes
      await this.presentToast('Error al cargar los datos', 'danger');
    } finally {
      if (event) {
        event.target.complete();
      } else {
        //se cierra el loading
        await this.miLoading.dismiss();
      }
    }
  }

  async editar(nota: Note) {
    const modal = await this.modalC.create({
      component: EditModalPage,
      cssClass: 'my-custom-class',
      componentProps: {
        note: nota,
      },
    });
    return await modal.present();
  }
  //Hacer estos metodos en el servicio
  /**
   * Metodo que elimina una nota con un ion-alert y llama a la funcion eliminarNota si el usuario acepta
   * @param nota que se va a eliminar
   */
  public async borra(nota: Note) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmación',
      subHeader: 'Borrado de nota ' + nota.tittle,
      message: '¿Está seguro de borrar la nota?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: async () => {
            await this.miLoading.dismiss();
          },
        },
        {
          text: 'Aceptar',
          handler: async () => {
            await this.ns.remove(nota.key);
            let i = this.notas.indexOf(nota, 0);
            if (i > -1) {
              this.notas.splice(i, 1);
            }
            await this.miLoading.dismiss();
          },
        },
      ],
    });
    await alert.present();
  }
  async presentLoading() {
    this.miLoading = await this.loadingController.create({
      message: '',
    });
    await this.miLoading.present();
  }

  async presentToast(msg: string, clr: string) {
    const miToast = await toastController.create({
      message: msg,
      duration: 2000,
      color: clr,
    });
    miToast.present();
  }

  public buscarNotas($event) {
    const texto = $event.target.value;
    if (texto.length > 0) {
      this.notas = this.notas.filter((note) => {
        return (note.tittle.toLowerCase().indexOf(texto.toLowerCase())) > -1;
      });
    } else {
      this.cargaNotas();
    }
  }


  public async cargaInfinita($event) {
    console.log('CARGANDO');
    let nuevasNotas = await this.ns.getNotesByPage().toPromise();
    if (nuevasNotas.length < 10) {
      $event.target.disable = true;
    }
    this.notas = this.notas.concat(nuevasNotas);
    $event.target.complete();
  }
}
