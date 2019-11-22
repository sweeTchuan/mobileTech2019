import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tp-login',
  templateUrl: './tp-login.page.html',
  styleUrls: ['./tp-login.page.scss'],
})
export class TpLoginPage implements OnInit {

  username: '';
  password: '';
  constructor(
    private httpClient: HttpClient,
    private router: Router) { }

  ngOnInit() {
  }
  login() {
    console.log('login function');

    this.httpClient.get('http://127.0.0.1:8000/api/user').subscribe(data => {
      console.log('my data: ', data);
      console.log(data[0]);

    });
    // this.toPosts();
  }

  toPosts() {
    this.router.navigateByUrl('tp-posts');
  }

}
