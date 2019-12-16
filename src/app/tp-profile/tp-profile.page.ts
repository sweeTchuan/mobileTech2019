import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import { User } from '../Models/User';
import { NavController, Platform } from '@ionic/angular';
import { GlobalSettingsService } from '../Services/global-settings.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-tp-profile',
  templateUrl: './tp-profile.page.html',
  styleUrls: ['./tp-profile.page.scss'],
})
export class TpProfilePage implements OnInit {
  objUser: User;
  txtUsername: string;
  txtSrcProfileImage: string = this.global.DefaultProfilePic;
  txtName: string;
  txtEmail: string;
  isReload = true;
  isUpdated = false;

  constructor(
    private router: Router,
    private storage: Storage,
    public navCtrl: NavController,
    private global: GlobalSettingsService,
    private ref: ChangeDetectorRef,
    private plt: Platform,

  ) { }

  // load user details on page
  ngOnInit() {
    console.log('ngOnInit: ProfilePage');
    this.plt.ready().then(() => {
      this.storage.get('currentUser').then((val) => {
        if (val != null || !val.isUndefined) {
          console.log('storage: profile user => ', val);
          this.objUser = val;
          this.loadUserDetails();
          this.isReload = false;
        }
      });
    });

  }

  ionViewWillEnter() {
    if (this.isReload) {
      this.reloadProfile();
    } else {
      this.isReload = true;
    }
    console.log('ionviewwillenter: ProfilePage');
    console.log('storage: objUser => ', this.objUser);
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter: ProfilePage');
    console.log('storage: objUser => ', this.objUser);
    this.loadUserDetails();
  }

  // load user details from local storage
  loadUserDetails() {
    this.txtUsername = isNullOrUndefined(this.objUser.username) ? '' : this.objUser.username;
    if (!isNullOrUndefined(this.objUser.profilePicUrl) && this.objUser.profilePicUrl !== '') {
      if(this.isUpdated){
        this.txtSrcProfileImage = this.objUser.profilePicUrl;
      }else{
        this.txtSrcProfileImage = this.global.fn_imageURL(this.objUser.profilePicUrl);
      }
      console.log('loadUserDetails: picURL=> ', this.txtSrcProfileImage);
    }
    this.txtName = isNullOrUndefined(this.objUser.name) ? '' : this.objUser.name;
    this.txtEmail = isNullOrUndefined(this.objUser.email) ? '' : this.objUser.email;
    this.ref.detectChanges();
  }

  // button to logout and navigate back to login page
  logOut() {
    // remove current user from local storge
    this.storage.remove('currentUser').then(val => {
      this.router.navigateByUrl('', { replaceUrl: true });
    });
  }

  // navigate to edit profile page
  goToEditProfile() {
    this.router.navigateByUrl('tp-edit-profile');
  }

  // reload current user from local storage
  reloadProfile() {
    // for some reason, ionic storage has time lag when retrieving data
    // need be solved in the future build. 
    this.storage.get('currentUser').then((val) => {
        console.log('storage: reload profile user => ', val);
        this.objUser = val;
        this.objUser.isUpdate = val.isUpdate;
        this.isUpdated = this.objUser.isUpdate;
        this.loadUserDetails();
    });
  }

}
