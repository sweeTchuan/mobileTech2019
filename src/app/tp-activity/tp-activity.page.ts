import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-tp-activity',
  templateUrl: './tp-activity.page.html',
  styleUrls: ['./tp-activity.page.scss'],
})
export class TpActivityPage implements OnInit {

  testdata: Observable<any>;
  constructor( private http: HttpClient) { }

  ngOnInit() {
    this.testdata = this.http.get('http://127.0.0.1:8000/api/user');
    this.testdata.subscribe(data => {
      console.log('my data: ', data);
    });
  }

}
