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

  }

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
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
    // console.log(confirmed)
    var toRun = 'testinvoke 0x2cd1380a87107b8bc3731871f7ea3318a167d06d update [“newsletter_1”,“QmfTJTArNhjKbZtXuZFbg5tZPugughDiTTPWnMaLScsEgJ”]'
    alert(toRun);
    // this.authService.unsubscribe("AAA")
  }

  unsubscribe(){
    console.log("unsubscribe")
    this.subscribed = false
    // console.log(confirmed)
    var toRun = 'testinvoke 0x2cd1380a87107b8bc3731871f7ea3318a167d06d update [“newsletter_1”,“QmQ6YMDhikq9TdVWBDRxwgvrEPxKnsvHvxMXBMDTZqXeQo”]'
    alert(toRun);
    // this.authService.unsubscribe("AAA")
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
