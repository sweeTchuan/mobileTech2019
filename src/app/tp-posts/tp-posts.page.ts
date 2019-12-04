import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Post } from '../Models/post';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GlobalSettingsService } from '../Services/global-settings.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tp-posts',
  templateUrl: './tp-posts.page.html',
  styleUrls: ['./tp-posts.page.scss'],
})
export class TpPostsPage implements OnInit {

  posts = [];
  constructor(
    private http: HttpClient,
    private router: Router,
    private global: GlobalSettingsService,
    private storage: Storage,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadPosts();
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

}
