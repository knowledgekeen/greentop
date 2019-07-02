import { Injectable } from "@angular/core";
import { EncDecService } from "./enc-dec.service";

@Injectable({
  providedIn: "root"
})
export class SessionService {
  constructor(private _encdec: EncDecService) { }

  getData(key: string) {
    let promise = new Promise((resolve, reject) => {
      if (sessionStorage) {
        if (sessionStorage.getItem(key)) {
          //let sessionval = this._encdec.decrypt(sessionStorage.getItem(key));
          resolve(this._encdec.decrypt(sessionStorage.getItem(key)));
        } else {
          reject("Key not found in Storage.");
        }
      } else {
        reject("session storage not found");
      }
    });

    return promise;
  }

  setData(key: string, dataobj: any) {
    let promise = new Promise((resolve, reject) => {
      if (sessionStorage) {
        sessionStorage.setItem(key, this._encdec.encrypt(dataobj));
        resolve();
      } else {
        reject("session storage not found");
      }
    });

    return promise;
  }

  deleteSession() {
    let promise = new Promise((resolve, reject) => {
      sessionStorage.removeItem('userdets');
      sessionStorage.clear();
      resolve();
    });
    return promise;
  }
}
