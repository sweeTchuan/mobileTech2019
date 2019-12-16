import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
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
import { Image } from '../Models/Image';

const STORAGE_KEY = 'my_profileImages';

@Component({
  selector: 'app-tp-upload-profile-pic',
  templateUrl: './tp-upload-profile-pic.page.html',
  styleUrls: ['./tp-upload-profile-pic.page.scss'],
})
export class TpUploadProfilePicPage implements OnInit {

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
  ) { }

  txtSrcProfileImage;
  objTempImage: Image;
  txtCurrentUser;
  txtImageButton = 'Insert a Photo';
  savedSignUpUser;
  notCompleteSignUp = true;   // toggle 'Complete Sign up' button

  ngOnInit() {
    console.log('ngOnInit: UploadProfilePicPage');
    this.plt.ready().then(() => {

      // load current sign up user details to this page
      this.storage.get('currentSignUpUser').then((val) => {
        this.savedSignUpUser = val;
        this.loadDetails();

      });

    });
    this.objTempImage = new Image();
    this.txtSrcProfileImage = this.global.DefaultProfilePic;
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter: UploadProfilePicPage');
    console.log('view enter upload profile => ', this.txtCurrentUser);
  }

  ionViewDidEnter() {
    this.loadDetails();
    console.log('view enter upload profile => ', this.txtCurrentUser);
  }

  // making sure this page receive the saved current sign up user
  loadDetails() {
    this.txtCurrentUser = this.savedSignUpUser;
    this.ref.detectChanges();
  }

  toLogin() {
    this.router.navigateByUrl('tp-login');
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();

  }

  // =====================================================
  // the following functions is modified based on tutorial
  // - get image from camera and local file directory
  // - creating, saving and extracting the image file path
  // source:
  // https://devdactic.com/ionic-4-image-upload-storage/
  // =====================================================

  // button function to select image
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

  // function that handles the selection of image from camera or local file
  takePicture(sourceType: PictureSourceType) {
    console.log('=> takePicture');
    let options: CameraOptions = {
      quality: 20,  // change this to modify quality of the image/size.
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

  // save the selected image in temperory storage.
  // then update the view of profile pic
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

      this.objTempImage.name = name;
      this.objTempImage.path = resPath;
      this.objTempImage.filePath = filePath;
      this.updateView();

    });
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

  // prompt for selecting file that is not valid image format
  async invalidFileAlertPrompt(msg) {
    const alert = await this.alertController.create({
      header: 'Insert Image',
      subHeader: 'Unsuccessful',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  // update the page view
  updateView() {
    this.txtSrcProfileImage = this.objTempImage.path;
    this.notCompleteSignUp = false;
    this.txtImageButton = 'Change photo';
    this.ref.detectChanges(); // trigger change detection cycle
  }

  // button to start upload process
  updateProfilePic() {
    console.log('=> updateProfilePic');
    console.log(this.txtCurrentUser);
    this.startUpload();
  }

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

  // read image file and prepare Post method input
  readFile(file: any) {
    console.log('=> readFile');
    console.log('File =>', file);
    const reader = new FileReader();
    reader.onloadend = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });
      formData.append('image_profile', imgBlob, file.name);
      console.log('username =>', this.txtCurrentUser);
      formData.append('username', this.txtCurrentUser);
      formData.append('action', 'update_user_profile_pic');

      this.uploadImageData(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  // upload image api, redirect to login page when success
  async uploadImageData(formData: FormData) {
    const loading = await this.loadingController.create({
      message: 'Uploading image...',
    });

    await loading.present();

    this.http.post(this.global.fn_ApiURL('user'), formData)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe(res => {
        console.log('upload profile image=> ', res);
        if (res['status']) {
          this.presentToast('add Profile Photo Success.')
          this.toLogin();
        } else {
          this.presentToast('Profile Photo upload failed.')
        }
      });

  }

}
