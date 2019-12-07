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

  constructor(
    private router: Router,
    private storage: Storage,
    public navCtrl: NavController,
    private global: GlobalSettingsService,
    private ref: ChangeDetectorRef,
    private plt: Platform,

  ) { }

  ngOnInit() {
    console.log('ngOnInit: ProfilePage');
    this.plt.ready().then(() => {
      this.storage.get('currentUser').then((val) => {
        if (val != null || !val.isUndefined) {
          console.log('storage: profile user => ', val);
          this.objUser = val;
          this.loadUserDetails();
        }
      });
    });

  }
  ionViewWillEnter() {
    console.log('ionviewwillenter: ProfilePage');
    console.log('storage: objUser => ', this.objUser);
  }
  ionViewDidEnter() {
    console.log('ionViewDidEnter: ProfilePage');
    console.log('storage: objUser => ', this.objUser);
    this.loadUserDetails();

  }

  loadUserDetails() {
    this.txtUsername = isNullOrUndefined(this.objUser.username) ? '' : this.objUser.username;
    if (!isNullOrUndefined(this.objUser.profilePicUrl) && this.objUser.profilePicUrl !== '') {
      this.txtSrcProfileImage = this.global.fn_imageURL(this.objUser.profilePicUrl);
      console.log('loadUserDetails: picURL=> ', this.txtSrcProfileImage);
    }
    this.txtName = isNullOrUndefined(this.objUser.name) ? '' : this.objUser.name;
    this.txtEmail = isNullOrUndefined(this.objUser.email) ? '' : this.objUser.email;
    this.ref.detectChanges();
  }

  logOut() {
    this.storage.remove('currentUser').then(val => {
      // this.navCtrl.pop();
      // this.navCtrl.navigateBack('tp-login');
      // this.router.ngOnDestroy();
      // this.router.dispose();
      this.router.navigateByUrl('', { replaceUrl: true });
      // this.router.navigateByUrl('tp-login');
    });

  }

  goToEditProfile() {
    this.router.navigateByUrl('tp-edit-profile');
  }

}
