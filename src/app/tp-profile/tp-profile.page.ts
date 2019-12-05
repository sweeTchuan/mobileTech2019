import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import { User } from '../Models/User';
import { NavController } from '@ionic/angular';
import { GlobalSettingsService } from '../Services/global-settings.service';
import { isNull } from 'util';
import { Post } from '../Models/post';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tp-profile',
  templateUrl: './tp-profile.page.html',
  styleUrls: ['./tp-profile.page.scss'],
})
export class TpProfilePage implements OnInit {
  objUser: User;
  txtUsername: string;
  txtSrcProfileImage: string;
  posts = [];
  
  constructor(
    private router: Router,
    private storage: Storage,
    public navCtrl: NavController,
    private global: GlobalSettingsService,
    private ref: ChangeDetectorRef,
    private http: HttpClient

  ) { }

  ngOnInit() {
    this.storage.get('currentUser').then((val) => {
      if(val != null){
        console.log('storage: profile user => ', val);
        this.objUser = val;
      }
    });
    this.loadPosts();
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
  
  editProfile(){
    this.router.navigateByUrl('tp-edit-profile');
  }

  async loadPosts() {
    this.http.post(this.global.fn_ApiURL('getposts'), []).subscribe(data => {
      console.log('request Posts data => ', data['data']);
      for (let obj of data['data']) {
        // console.log('i want username => ' , obj.user.username);
        let postObj = new Post();
        postObj.id = obj.id;
        postObj.caption = obj.caption;
        postObj.pictureUrl = this.global.fn_imageURL(obj.picture_url);
        postObj.username = obj.user.username;
        postObj.date = obj.created_at;
        if (obj.user.user_profile_pic == null || obj.user.user_profile_pic == '') {
          postObj.userProfileUrl = '/assets/instagram.png';
        } else {
          postObj.userProfileUrl = obj.user.user_profile_pic;
        }
        this.posts.push(postObj);
        this.ref.detectChanges();
        // console.log(obj.postObj);
      }

    }, error => {
      console.log(error);
    });

  }

  goToPost(poi, i){
    console.log('wat',poi,i);
    this.router.navigateByUrl('tp-one-post');
  }

}
