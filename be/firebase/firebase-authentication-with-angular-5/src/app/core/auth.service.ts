import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import * as objHash from 'object-hash';
import * as IPFS from 'ipfs-api';
import * as  NodeRSA from 'node-rsa';
import * as CryptoJS from "crypto-js";
import { HttpClient } from '@angular/common/http';

declare const Buffer


@Injectable()
export class AuthService {

  constructor(
   public afAuth: AngularFireAuth,
   public http: HttpClient
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

  unsubscribe(user_mail){
    console.log("UNSUBSCRIBE")
    const firestore = firebase.firestore();
    var key = this.generateKey();
    var hash = objHash(this.encrypt(user_mail, key));
    var queryRef = firestore.collection('permissions').where('hash', '==', hash);
    queryRef.get().then(res => {

      console.log(res)
      res.docs.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
        });
    }, err => console.log(err))
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

hex2a(hexx) {
      var hex = hexx.toString();
      var str = '';
      for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      return str;
    }

displayHash (hash) {
  var ipfs = IPFS("localhost", "5001", {protocol: "http"});
  ipfs.files.cat(hash, function (err, res) {
   if (err || !res) {
     return console.error('ipfs cat error', err, res)
   }
   console.log(hash)
   console.log(res.toString())
   document.getElementById('subscribers').innerText = res.toString()
 })
}

testpost() {
  this.http.post("http://localhost:30333",
    {
    "jsonrpc": "2.0",
    "method": "invokefunction",
    "params": [
      "0x2cd1380a87107b8bc3731871f7ea3318a167d06d",
      "list",
      [
        {
          "type": "String",
          "value": "newsletter_1"
        }
      ]
    ],
    "id": 1
    })
    .subscribe(
        (val) => {
          console.log(val.result.stack[4].value);
          var hash = this.hex2a(val.result.stack[4].value);
          this.displayHash(hash)
          console.log("IPFS hash received from blockchain: ",hash);
        },
        response => {
            console.log("POST call in error", response);
        },
        () => {
            console.log("The POST observable is now completed.");
        });
}





 goToIpfs(){
// https://ipfs.io/ipfs/
  this.testpost()
 // console.log( this.http.get("www.google.be"))


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
     hash: objHash(this.encrypt(email, key)),
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
