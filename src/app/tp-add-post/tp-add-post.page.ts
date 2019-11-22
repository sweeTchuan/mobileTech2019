import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tp-add-post',
  templateUrl: './tp-add-post.page.html',
  styleUrls: ['./tp-add-post.page.scss'],
})
export class TpAddPostPage implements OnInit {
  postImage;

  constructor() { }

  ngOnInit() {
    this.postImage = '/assets/testc1.jpg';
  }

}
