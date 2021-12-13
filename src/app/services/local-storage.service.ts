import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  /**
   * Método para guardar localmente datos almacenado en tipo 
   * json con clave valor, usamos JSON.stringify() para convertir
   * el objeto a String.
   * @param key string clave del documento
   * @param value object valor del documento
   * @returns true si se realiza la insercción correctamente
   *          false si no se realiza la insercción correctamente
   */
  public async setItem(key: string, value: any): Promise<boolean> {
    let result: boolean = false;
    try {
      await Storage.set({
        key: key,
        value: JSON.stringify(value)
      })
      result = true;
    } catch (error) {
      console.error(error);
    }
    return Promise.resolve(result);
  }

  /**
   * Método que devuelve el valor de un documento
   * dada su clave.
   * @param key string clave del documento 
   */
  public async getItem(key: string): Promise<any> {
    let data = null;
    try {
      data = await Storage.get({ key: key });
      //lo devuelve como json {data: value}
      // y cojo value de data
      data = data.value;
      if (data != null) data = JSON.parse(data);
    } catch (error) {
      console.error(error);
    }
    return Promise.resolve(data);
  }


  /**
   * Método que elimina un documento dada su clave
   * @param key string clave del documento
   * @returns true si lo hace correctamente
   */
  public async removeItem(key: string): Promise<boolean> {
    let result: boolean = false;
    try {
      await Storage.remove({ key: key })
      result = true;
    } catch (error) {
      console.error(error)
    }
    return result;
  }
}
