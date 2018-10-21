import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import * as objHash from 'object-hash';
import * as IPFS from 'ipfs-api';
import * as  NodeRSA from 'node-rsa';
import * as CryptoJS from "crypto-js";

declare const Buffer


@Injectable()
export class AuthService {

  constructor(
   public afAuth: AngularFireAuth
 ){}

  doFacebookLogin(){
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      })
    })
  }

  doTwitterLogin(){
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.TwitterAuthProvider();
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      })
    })
  }


generateKey(){
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

encrypt(phrase, key){
  var ciphertext = CryptoJS.AES.encrypt(phrase, key);
  return ciphertext.toString()
}

decrypt(phrase, key){
  var bytes  = CryptoJS.AES.decrypt(phrase.toString(), key);
  var plaintext = bytes.toString(CryptoJS.enc.Utf8);
}


 goToIpfs(){

    var ipfs = IPFS("localhost", "5001", {protocol: "http"});
    // const ipfs = IpfsApi({
    //   host: 'localhost',
    //   port: 5001,
    //   protocol: 'http',
    //   headers: {
    //     authorization: 'Bearer ' + TOKEN
    //   }
    // })

    function store () {
      // var toStore = {item:"TEST"}
      ipfs.files.add(Buffer.from("TEST"), function (err, res) {
        if (err || !res) {
          return console.error('ipfs add error', err, res)
        }

        res.forEach(function (file) {
          if (file && file.hash) {
            console.log('successfully stored', file.hash)
            // display(file.hash)
          }
        })
      })
    }
    store ()
  }


 saveNewUser(email){
   this.goToIpfs()
   const firestore = firebase.firestore();
   var key = this.generateKey()
   // var encrypted = encrypt(phrase, key);
   // var decrypted = decrypt(phrase, key)
   var data = {
     email_for_human_readeability: email,
     decryption_key: key,
     encrypted_email: this.encrypt(email, key),
     gender: 'M',
     hash: objHash(email),
     subscription: 'default_newsletter'
   };
   var setDoc = firestore.collection('permissions').add(data);
 }


  doGoogleLogin(){
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth.auth
      .signInWithPopup(provider)
      .then(res => {
        console.log(res);
        console.log('test')
        console.log(res.user.email)
        console.log(res.additionalUserInfo.profile)
        this.saveNewUser(res.user.email)
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      })
    })
  }

  doRegister(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(res => {

        console.log(res)
        this.saveNewUser(value.email)
        resolve(res);
      }, err => reject(err))
    })
  }

  doLogin(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      .then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }

  doLogout(){
    return new Promise((resolve, reject) => {
      if(firebase.auth().currentUser){
        this.afAuth.auth.signOut()
        resolve();
      }
      else{
        reject();
      }
    });
  }


}
