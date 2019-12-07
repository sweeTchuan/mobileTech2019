import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { ActionSheetController, ToastController, Platform, LoadingController, AlertController } from '@ionic/angular';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { FilePath } from '@ionic-native/file-path/ngx';
import { finalize } from 'rxjs/operators';
import { GlobalSettingsService } from '../Services/global-settings.service';
import { User } from '../Models/User';
import { Router } from '@angular/router';
// import { SelectImageService } from '../Services/select-image.service';
import { Image } from '../Models/Image';
// import { Observable } from 'rxjs';

const STORAGE_KEY = 'my_images';

@Component({
  selector: 'app-tp-add-post',
  templateUrl: './tp-add-post.page.html',
  styleUrls: ['./tp-add-post.page.scss'],
})
export class TpAddPostPage implements OnInit {

  txtImageButton = 'Share a Photo!';
  txtCaption;
  objTempImage: Image;
  txtSrcImage;
  // imgTempPost;
  objUser: User;
  isNoImage = true;

  constructor(
    private router: Router,
    private camera: Camera,
    private file: File,
    private http: HttpClient,
    private webview: WebView,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private storage: Storage,
    private plt: Platform,
    private loadingController: LoadingController,
    private ref: ChangeDetectorRef,
    private filePath: FilePath,
    private global: GlobalSettingsService,
    private alertController: AlertController,
    // private imgSvc: SelectImageService,
  ) { }

  ngOnInit() {
    console.log('ngOnInit: AddPostsPage');
    this.plt.ready().then( () => {
      this.storage.get('currentUser').then((val: User) => {
        this.objUser = val;
        this.ref.detectChanges();
      });
      console.log('ngOnInit: this.objUser =>', this.objUser);

    });
    this.objTempImage = new Image();
  }
  ionViewWillEnter(){
    console.log('ionviewwillenter: AddPostsPage');
    console.log('ionviewwillenter: this.objUser =>', this.objUser);
  }
  ionViewDidEnter(){
    console.log('ionViewDidEnter: AddPostsPage');
    console.log('ionViewDidEnter: this.objUser =>', this.objUser);

  }

  pathForImage(img) {
    console.log('=> pathForImage');
    if (img === null) {
      return '';
    } else {
      let converted = this.webview.convertFileSrc(img);
      return converted;
    }
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();

  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Image source',
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  takePicture(sourceType: PictureSourceType) {
    console.log('=> takePicture');
    let options: CameraOptions = {
      quality: 20,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imagePath => {
      if (this.plt.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            console.log('=> takePicture Android');
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          }, error => {
            console.log('err', error);
            this.invalidFileAlertPrompt('Invalid image file. Please choose again.');
          });
      } else {
        console.log('=> takePicture OTHER');
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    });

  }
  createFileName() {
    console.log('=> createFileName');
    let d = new Date(),
      n = d.getTime(),
      newFileName = n + '.jpg';
    return newFileName;
  }

  copyFileToLocalDir(namePath, currentName, newFileName) {
    console.log('=> copyFileToLocalDir');
    this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
      this.updateStoredImages(newFileName);
    }, error => {
      this.presentToast('Error while storing file.');
    });
  }

  updateStoredImages(name) {
    console.log('=> updateStoredImages');
    this.storage.get(STORAGE_KEY).then(images => {
      let arr = JSON.parse(images);
      if (!arr) {
        let newImages = [name];
        this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
      } else {
        arr.push(name);
        this.storage.set(STORAGE_KEY, JSON.stringify(arr));
      }

      let filePath = this.file.dataDirectory + name;
      let resPath = this.pathForImage(filePath);
      console.log('resPath => ', resPath);
      console.log('filePath => ', filePath);

      // let newEntry = {
      //   name: name,
      //   path: resPath,
      //   filePath: filePath
      // };
      // this.images = [newEntry, ...this.images];

      // this.objTempImage = newEntry;

      this.objTempImage.name = name;
      this.objTempImage.path = resPath;
      this.objTempImage.filePath = filePath;
      this.updateAddPostView();

    });
  }

  async invalidFileAlertPrompt(msg) {
    const alert = await this.alertController.create({
      header: 'Insert Image',
      subHeader: 'Unsuccessful',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  updateAddPostView() {
    this.txtSrcImage = this.objTempImage.path;
    this.isNoImage = false;
    this.txtImageButton = 'Change Photo';
    this.ref.detectChanges(); // trigger change detection cycle
  }

  deleteImage(imgEntry) {
  // deleteImage(imgEntry, position) {
    // this.images.splice(position, 1);

    this.storage.get(STORAGE_KEY).then(images => {
      let arr = JSON.parse(images);
      let filtered = arr.filter(name => name != imgEntry.name);
      this.storage.set(STORAGE_KEY, JSON.stringify(filtered));

      let correctPath = imgEntry.filePath.substr(0, imgEntry.filePath.lastIndexOf('/') + 1);

      this.file.removeFile(correctPath, imgEntry.name).then(res => {
        this.presentToast('File removed.');
      });
    });
  }

  prepareUpload() {
    console.log('=> prepareUpload');
    console.log('ATTENTION => need to do no image checking');
    this.startUpload();
  }

  // startUpload(imgEntry) {
  startUpload() {
    console.log('=> startUpload ...');

    this.file.resolveLocalFilesystemUrl(this.objTempImage.filePath)
      .then(entry => {
        // ( < FileEntry > entry).file(file => this.readFile(file))
        (entry as FileEntry).file(file => this.readFile(file));
        console.log('File Entry =>', entry);
      })
      .catch(err => {
        this.presentToast('Error while reading file.');

      });
  }

  readFile(file: any) {
    console.log('=> readFile');
    console.log('File =>', file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });
      formData.append('image', imgBlob, file.name);
      formData.append('caption', this.txtCaption);
      formData.append('user_id', this.objUser.id.toString());

      this.uploadImageData(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  async uploadImageData(formData: FormData) {
    const loading = await this.loadingController.create({
      message: 'Uploading image...',
    });

    await loading.present();
    console.log('check complete');

    // this.http.post("http://localhost:8888/upload.php", formData)
    this.http.post(this.global.fn_ApiURL('newpost'), formData)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe(res => {
        console.log(res);
        if (res['status']) {

          this.presentToast('File upload complete.');
          this.resetPage();
          this.presentAlertPrompt();
        } else {
          this.presentToast('File upload failed.')
        }
      });

  }

  resetPage(){
    this.deleteImage(this.objTempImage);
    this.isNoImage = true;
    this.txtCaption = '';
    this.txtImageButton = 'Share a Photo!';
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Share a photo post',
      subHeader: 'Successful',
      message: 'Share new photo again?',
      buttons: [
        {
          text: 'Yes',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Continue New Share Photo');
          }
        }, {
          text: 'No',
          handler: data => {
            this.router.navigateByUrl('/start/tabs/posts');

            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

}
