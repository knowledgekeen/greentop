import { Injectable } from "@angular/core";
import SimpleCrypto from "simple-crypto-js";

@Injectable({
  providedIn: "root"
})
export class EncDecService {
  _secretKey = "gt0rg$nics";
  constructor() {}

  encrypt(obj) {
    let simpleCrypto = new SimpleCrypto(this._secretKey);
    let cipherObj = simpleCrypto.encrypt(obj);
    return cipherObj;
  }

  decrypt(cipherObj) {
    let simpleCrypto = new SimpleCrypto(this._secretKey);
    return simpleCrypto.decrypt(cipherObj, true);
  }
}
