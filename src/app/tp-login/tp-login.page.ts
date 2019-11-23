import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { GlobalSettingsService } from '../Services/global-settings.service';

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
    private router: Router,
    private global: GlobalSettingsService) { }

  ngOnInit() {

  }

  login() {
    console.log('=> login function');
    const postData = {
      username: this.username,
      password : this.password,
      action : 'login_user'
    };

    this.httpClient.post(this.global.ApiPath('user'), postData).subscribe(data => {
      console.log('Request data => ', data);

      if(data['status'] === 1) {
        this.toPosts();
      }

    }, error => {
      console.log(error);
    });

  }

  toPosts() {
    this.router.navigateByUrl('start');
  }

  testGetAPI(){
    console.log('testing GET API')
    this.httpClient.get('http://' + this.global.apiIp + '/api-for-mobile-tech/public/api/testingg').subscribe(data => {
        console.log(data);
       }, error => {
        console.log(error);
    });

  }

  testPostAPI(){
    console.log('testing POST API')
    const postData = {

    };
    this.httpClient.post('http://' + this.global.apiIp + '/api-for-mobile-tech/public/api/testingp', postData).subscribe(data => {
        console.log(data);
       }, error => {
        console.log(error);
    });


  }

}
