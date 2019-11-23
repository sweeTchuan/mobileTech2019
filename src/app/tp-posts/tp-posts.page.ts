import { Component, OnInit } from '@angular/core';
import { Post } from '../Models/post';


@Component({
  selector: 'app-tp-posts',
  templateUrl: './tp-posts.page.html',
  styleUrls: ['./tp-posts.page.scss'],
})
export class TpPostsPage implements OnInit {

  samplePic = [
    'https://res.cloudinary.com/awesom3testing/image/upload/v1573831798/IMG_20170808_121414_loh4mc.jpg',
    'https://res.cloudinary.com/awesom3testing/image/upload/v1573831793/IMG_20170806_100827_y5ekd2.jpg',
    'https://res.cloudinary.com/awesom3testing/image/upload/v1573831784/IMG_20170314_204210_kejkim.jpg',
    'https://res.cloudinary.com/awesom3testing/image/upload/v1573831777/IMG_20170313_183935_vtvv5u.jpg',
    'https://res.cloudinary.com/awesom3testing/image/upload/v1573831772/IMG_20170313_155427_tcxi8m.jpg'
  ];

  posts = [];
  constructor() { }

  ngOnInit() {
    this.sampleData();
  }
  sampleData(){
    let count = 1;
    this.samplePic.forEach(element => {
      let post = new Post();
      post.caption = 'Hello ' + count;
      post.picture = element;
      this.posts.push(post);
      count++;
    });
  }

}
