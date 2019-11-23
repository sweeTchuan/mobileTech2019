import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { GlobalSettingsService } from '../Services/global-settings.service';

@Component({
  selector: 'app-tp-register',
  templateUrl: './tp-register.page.html',
  styleUrls: ['./tp-register.page.scss'],
})
export class TpRegisterPage implements OnInit {
  email = '';
  username = '';
  password = '';

  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private global: GlobalSettingsService) { }

  ngOnInit() {
  }

  register() {
    console.log('=> register function');

    const postData = {
      email: this.email,
      username: this.username,
      password : this.password,
      name : '',
      action : 'create_user'
    };


    this.httpClient.post(this.global.ApiPath('user'), postData).subscribe(data => {
        console.log('request data => ' , data);
        this.toLogin();

       }, error => {
        console.log(error);
    });

  }

  toLogin() {

    this.router.navigateByUrl('tp-login');
  }

  testingAPI(){
    // let ipAddress = '172.21.6.33';  // check ipconfig
    // let laravelProjectName = 'blog';
    // let apiName = 'user';
    // let apiPath = '/' + laravelProjectName + '/public/api/' + apiName; 
    // let url = 'http://' + ipAddress + apiPath;

    
  }

}
