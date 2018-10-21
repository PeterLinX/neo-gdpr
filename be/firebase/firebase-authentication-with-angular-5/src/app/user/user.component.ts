import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/user.service';
import { AuthService } from '../core/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseUserModel } from '../core/user.model';
// import * as firebase from 'firebase';

@Component({
  selector: 'page-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.scss']
})
export class UserComponent implements OnInit{

  user: FirebaseUserModel = new FirebaseUserModel();
  subscribed: boolean;
  profileForm: FormGroup;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private location : Location,
    private fb: FormBuilder
  ) {
    this.authService.testpost();
  }

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      this.subscribed = false;
      let data = routeData['data'];
      if (data) {
        this.user = data;
        this.createForm(this.user.name);
      }
    })
  }

  createForm(name) {
    this.profileForm = this.fb.group({
      name: [name, Validators.required ]
    });
  }

  subscribe(){
    console.log("subscribe")
    this.subscribed = true
    var toRun = 'testinvoke 0x2cd1380a87107b8bc3731871f7ea3318a167d06d update ["newsletter_1","QmfTJTArNhjKbZtXuZFbg5tZPugughDiTTPWnMaLScsEgJ"]'
    document.getElementById("hint").innerHTML = "<br/><br/><b>Hi Niels.. Sorry, I can't send a transaction yet.. Could you please manually run this? Thanks!</b><br/><br/>"+toRun;

  }

  unsubscribe(){
    console.log("unsubscribe")
    this.subscribed = false
    var toRun = 'testinvoke 0x2cd1380a87107b8bc3731871f7ea3318a167d06d update ["newsletter_1","QmQ6YMDhikq9TdVWBDRxwgvrEPxKnsvHvxMXBMDTZqXeQo"]'

    document.getElementById("hint").innerHTML = "<br/><br/><b>Hi Niels.. Sorry, I can't send a transaction yet.. Could you please manually run this? Thanks!</b><br/><br/>"+toRun;
  }

  refreshList(){
  this.authService.testpost();
  }

  save(value){

    this.userService.updateCurrentUser(value)
    .then(res => {
      console.log(res);
    }, err => console.log(err))
  }

  logout(){
    this.authService.doLogout()
    .then((res) => {
      this.location.back();
    }, (error) => {
      console.log("Logout error", error);
    });



  }
}
