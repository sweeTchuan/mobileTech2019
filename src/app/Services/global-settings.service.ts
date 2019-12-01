import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class GlobalSettingsService {

  // isLocal = false;

  // apiIpLocal = '127.0.0.1:8000';
  // apiPathLocal = '/api/';

  devApiIp = '172.21.6.53';  // check ipconfig
  devlaravelProjectName = 'api-for-mobile-tech';
  // laravelProjectName = 'api-for-mobile-tech';
  apiIp = '';  // check ipconfig
  laravelProject = '';
  
  dirApi = '/public/api/';
  dirImages =  '/public/storage/';

  apiPath = '';
  imagesPath = '';
  // apiPath = '/' + this.laravelProject + this.dirApi;
  // imagesPath = '/' + this.laravelProject + this.dirImages;

  DefaultPictureURL = 'https://res.cloudinary.com/awesom3testing/image/upload/v1574921095/default-image_wjzajz.jpg';
  // ImagesURLPATH = 'http://' + this.apiIp + this.imagesPath;

  constructor(
    private storage: Storage
  ) { }

  fn_initializeApiSettings(){
    this.fn_setApiIp();
    this.fn_setLaravelProject();

  }

  fn_setApiIp(){
    this.storage.get('serverIP').then((val) => {
      console.log('storage: serverIP =>', val);
      this.apiIp = (val == null) ? this.devApiIp : val;
      console.log('serverIP set =>', this.apiIp);

    });
  }
  fn_setLaravelProject(){
    this.storage.get('laravelProject').then((val) => {
      console.log('storage: laravelProject =>', val);
      this.laravelProject = (val == null) ? this.devlaravelProjectName : val;
      this.apiPath = '/' + this.laravelProject + this.dirApi;
      this.imagesPath = '/' + this.laravelProject + this.dirImages;
      console.log('laravelProject set =>', this.laravelProject);

    });
  }

  fn_changeApiIP(newIp){
    this.storage.set('serverIP', newIp);
    this.apiIp = newIp;
    console.log('serverIP change => ', this.apiIp);
  }
  
  fn_changeLaravelProject(newLaravelProject){
    this.storage.set('laravelProject', newLaravelProject);
    this.laravelProject = newLaravelProject;
    this.apiPath = '/' + this.laravelProject + this.dirApi;
    this.imagesPath = '/' + this.laravelProject + this.dirImages;
    console.log('laravelProject change => ', this.laravelProject);
  }

  fn_ApiURL(apiName){

    let url = 'http://' + this.apiIp + this.apiPath + apiName;
    console.log('API URL => ' + url);
    return url;

  }

  fn_imageURL(imageName){

    if (imageName === 'defaultpic'){
      return this.DefaultPictureURL;
    }else{
      let url = 'http://' + this.apiIp + this.imagesPath + imageName;
      console.log('image URL => ' + url);
      return url;
    }

  }


}
