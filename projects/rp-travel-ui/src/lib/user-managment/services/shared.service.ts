import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  encryptionKey =  CryptoJS.enc.Utf8.parse("abcdefghijklmnop");
  
  encryptData(password: string) {    
    let encryptedBytes = CryptoJS.AES.encrypt(password, this.encryptionKey, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
    
    return encryptedBytes.toString();
  }
}