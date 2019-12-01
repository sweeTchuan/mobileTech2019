import { Component, OnInit } from '@angular/core';
import { Post } from '../Models/post';
import { Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { GlobalSettingsService } from '../Services/global-settings.service';
import { Storage } from '@ionic/storage';
import { element } from 'protractor';
import { User } from '../Models/User';
import { currentId } from 'async_hooks';


@Component({
  selector: 'app-tp-posts',
  templateUrl: './tp-posts.page.html',
  styleUrls: ['./tp-posts.page.scss'],
})
export class TpPostsPage implements OnInit {
  userObj: User;

  samplePic = [
    'https://res.cloudinary.com/awesom3testing/image/upload/v1573831798/IMG_20170808_121414_loh4mc.jpg',
    'https://res.cloudinary.com/awesom3testing/image/upload/v1573831793/IMG_20170806_100827_y5ekd2.jpg',
    'https://res.cloudinary.com/awesom3testing/image/upload/v1573831784/IMG_20170314_204210_kejkim.jpg',
    'https://res.cloudinary.com/awesom3testing/image/upload/v1573831777/IMG_20170313_183935_vtvv5u.jpg',
    'https://res.cloudinary.com/awesom3testing/image/upload/v1573831772/IMG_20170313_155427_tcxi8m.jpg'
  ];

  posts = [];
  constructor(
    private http: HttpClient,
    private router: Router,
    private global: GlobalSettingsService,
    private storage: Storage
  ) { }

  ngOnInit() {
    this.loadPosts();
    // this.sampleData();
    this.getCurrentUser();
  }
  getCurrentUser(){
    
    this.storage.get('currentUser').then((val) => {
      this.getCurrentUser = val;
      console.log('currentUser =>', this.getCurrentUser);
    });
  }

  sampleData(){
    let count = 1;
    this.samplePic.forEach(element => {
      let post = new Post();
      post.caption = 'Hello ' + count;
      post.pictureUrl = element;
      this.posts.push(post);
      count++;
    });
  }
  async loadPosts(){
    await this.http.post(this.global.fn_ApiURL('getposts'), [] ).subscribe(data => {
      console.log('request data => ' , data['data']);
      for (let obj of data['data']){
        let postObj = new Post();
        postObj.id = obj.id;
        postObj.caption = obj.caption;
        postObj.pictureUrl = this.global.fn_imageURL(obj.picture_url);
        postObj.userId = obj.user_id;
        this.posts.push(postObj);
        // console.log(obj.postObj);
      }


     }, error => {
      console.log(error);
  });

  }

}
