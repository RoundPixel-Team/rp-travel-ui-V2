import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  encryptionKey = CryptoJS.enc.Utf8.parse('roundPixell!!!!!!!!&!!!//!!!!!!'); // Ensure it's parsed
  iv = CryptoJS.enc.Utf8.parse('1234567890123456'); // Fixed 16-byte IV for consistent encryption
  
  encryptData(password: string) {
      // const encrypted = CryptoJS.AES.encrypt(password, this.encryptionKey, {
      //     iv: this.iv, // Use the fixed IV
      //     mode: CryptoJS.mode.CBC,
      //     padding: CryptoJS.pad.Pkcs7,
      // });
  
      // return encrypted.toString(); // Only return the ciphertext
      return password;
  }
  
  decryptData(cipherText: string) {
      const decrypted = CryptoJS.AES.decrypt(cipherText, this.encryptionKey, {
          iv: this.iv, // Use the same fixed IV
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
      });
  
      return decrypted.toString(CryptoJS.enc.Utf8);
  }  
}