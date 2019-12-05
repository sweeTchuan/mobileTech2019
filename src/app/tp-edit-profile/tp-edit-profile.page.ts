import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tp-edit-profile',
  templateUrl: './tp-edit-profile.page.html',
  styleUrls: ['./tp-edit-profile.page.scss'],
})
export class TpEditProfilePage implements OnInit {

  constructor() { }

  txtName;
  txtUsername;
  txtEmail;
  txtSrcProfileImage = '/assets/instagram.png';

  ngOnInit() {
    console.log('=> ngOnInit: editProfile');
    this.txtEmail = 'email.com';
  }

  changeProfilePhoto(){
    console.log('=> changeProfilePhoto');
  }
  
  updateProfile(){
    console.log('=> updateProfile', this.txtName);
    console.log('txtName =>', this.txtName);
    console.log('txtUsername =>', this.txtUsername );
    console.log('txtEmail =>',this.txtEmail);
    

  }

}
