import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import { User } from '../Models/User';
import { NavController } from '@ionic/angular';
import { GlobalSettingsService } from '../Services/global-settings.service';
import { isNull } from 'util';

@Component({
  selector: 'app-tp-profile',
  templateUrl: './tp-profile.page.html',
  styleUrls: ['./tp-profile.page.scss'],
})
export class TpProfilePage implements OnInit {
  objUser: User;
  txtUsername: string;
  txtSrcProfileImage: string;

  
  constructor(
    private router: Router,
    private storage: Storage,
    public navCtrl: NavController,
    private global: GlobalSettingsService,

  ) { }

  ngOnInit() {
    this.storage.get('currentUser').then((val) => {
      if(val != null){
        console.log('storage: profile user => ', val);
        this.objUser = val;
      }
    });
  }
  ionViewWillEnter(){
    console.log('ionviewwillenter profile');
    this.loadUser();
  }

  loadUser(){
    this.txtUsername = isNull(this.objUser.username) ? 'Profile' : this.objUser.username;
    if(this.objUser.profilePicUrl == null){
      console.log('where u go');
      this.txtSrcProfileImage = this.global.DefaultProfilePic;
    } else {
      console.log('where u go2',this.objUser.profilePicUrl);
      this.txtSrcProfileImage = this.objUser.profilePicUrl;
    }

  }

  logOut(){
    // this.storage.get('currentUser').then((val: User ) => {
    //   val.isLogin = false;
    //   this.storage.set('currentUser', val);

    // });
    this.storage.remove('currentUser').then(val => {
      // this.navCtrl.pop();
      // this.navCtrl.navigateBack('tp-login');
      // this.router.ngOnDestroy();
      // this.router.dispose();
      this.router.navigateByUrl('', { replaceUrl: true });
      // this.router.navigateByUrl('tp-login');
    });   
  }

}
