import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';
// import { HTTP } from '@ionic-native/http/ngx';
// import { Observable } from 'rxjs/Observable';
// import { Observable } from 'rxjs';
// import 'rxjs/add/operator/map';


@Component({
  selector: 'app-tp-register',
  templateUrl: './tp-register.page.html',
  styleUrls: ['./tp-register.page.scss'],
})
export class TpRegisterPage implements OnInit {
  email = '';

  constructor(
    private router: Router,
    private httpClient: HttpClient) { }

  ngOnInit() {
  }
  register() {
    // this.router.navigateByUrl('home');

    console.log(this.email);


    this.httpClient.get('http://127.0.0.1:8000/api/user').subscribe(data => {
      console.log('my data: ', data);
      console.log(data[0]);
      console.log(data[0].id);
      console.log(data[0].name);
      console.log(data[0].age);


    });

    // var headers = new Headers();
    // headers.append("Accept", 'application/json');
    // headers.append('Content-Type', 'application/json' );
    // const requestOptions = new RequestOptions({ headers: headers });

    const postData = {
            "name": this.email,
            "age": "23"
    }

    this.httpClient.post("http://127.0.0.1:8000/api/user", postData).subscribe(data => {
        console.log(data);
       }, error => {
        console.log(error);
      });




 

  }

}
