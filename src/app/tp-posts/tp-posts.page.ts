import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Post } from '../Models/post';
// import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GlobalSettingsService } from '../Services/global-settings.service';
// import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-tp-posts',
  templateUrl: './tp-posts.page.html',
  styleUrls: ['./tp-posts.page.scss'],
})
export class TpPostsPage implements OnInit {

  posts = [];
  constructor(
    private http: HttpClient,
    // private router: Router,
    private global: GlobalSettingsService,
    // private storage: Storage,
    private ref: ChangeDetectorRef,
    private plt: Platform,
  ) { }

  ngOnInit() {
    console.log('ngOnInit: PostsPage');
    this.plt.ready().then(() => {
      this.loadPosts();
    });
  }

  ionViewWillEnter() {
    console.log('ionviewwillenter: PostsPage');
  }

  ionViewDidEnter() {
    console.log('ionViewDidEnter: PostsPage');

  }

  // load all post from api
  async loadPosts() {
    this.http.post(this.global.fn_ApiURL('getposts'), []).subscribe(data => {
      console.log('request Posts data => ', data['data']);
      for (let obj of data['data']) {
        let postObj = new Post();
        postObj.id = obj.id;
        postObj.caption = obj.caption;
        postObj.pictureUrl = this.global.fn_imageURL(obj.picture_url);
        postObj.username = obj.user.username;
        postObj.date = obj.created_at;

        // setting image for profile picture
        if (isNullOrUndefined(obj.user.pic_path_name) || obj.user.pic_path_name === '') {
          postObj.userProfileUrl = this.global.DefaultProfilePic;
        } else {
          postObj.userProfileUrl = this.global.fn_imageURL(obj.user.pic_path_name);
        }

        // inserting photo post to array
        this.posts.push(postObj);
        this.ref.detectChanges();
      }

    }, error => {
      console.log(error);
    });

  }

  // pull down to refresh action
  doRefresh(event) {
    console.log('Begin async operation');
    this.reloadPostsData();

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  // clear all photo post in array and load latest 
  reloadPostsData() {
    while (this.posts.length > 0) {
      this.posts.pop();
    }
    this.loadPosts();

  }

}
