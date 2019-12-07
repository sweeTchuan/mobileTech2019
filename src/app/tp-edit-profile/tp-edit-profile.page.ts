import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Platform, ActionSheetController, ToastController, LoadingController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { User } from '../Models/User';
import { isNullOrUndefined } from 'util';
import { GlobalSettingsService } from '../Services/global-settings.service';
import { HttpClient } from '@angular/common/http';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Image } from '../Models/Image';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/camera/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';

const STORAGE_KEY = 'my_profileImages';

@Component({
  selector: 'app-tp-edit-profile',
  templateUrl: './tp-edit-profile.page.html',
  styleUrls: ['./tp-edit-profile.page.scss'],
})
export class TpEditProfilePage implements OnInit {

  constructor(
    private plt: Platform,
    private router: Router,
    private ref: ChangeDetectorRef,
    private storage: Storage,
    private global: GlobalSettingsService,
    private http: HttpClient,
    private camera: Camera,
    private file: File,
    private webview: WebView,
    private actionSheetController: ActionSheetController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private filePath: FilePath,
    private alertController: AlertController,
    // private nav: Navigation,

  ) { }

  objUser: User;
  txtName;
  txtUsername;
  txtEmail;
  txtSrcProfileImage = '/assets/instagram.png';
  noChanges = true;
  notAvailableUsername = true;
  notAvailableEmail = true;
  imageChanged = false;
  profileSectionChanged = false;
  objTempImage: Image;

  ngOnInit() {
    console.log('ngOnInit: editProfile');
    this.plt.ready().then(() => {
      this.storage.get('currentUser').then((val) => {
        if (!isNullOrUndefined(val)) {
          console.log('storage: profile user => ', val);
          this.objUser = val;
          this.loadUserDetails();
          this.objTempImage = new Image();
        }
      });
    });
  }
  ionViewWillEnter() {
    console.log('ionViewWillEnter: editProfile');

  }

  ionViewDidEnter() {
    console.log('ionViewWillEnter: editProfile');
    this.loadUserDetails();
  }

  changeProfilePhoto() {
    console.log('=> changeProfilePhoto');
    // this.toggleConfirmBtn();

  }

  toggleConfirmBtn() {
    this.noChanges = !this.noChanges;
  }

  loadUserDetails() {
    this.txtUsername = isNullOrUndefined(this.objUser.username) ? '' : this.objUser.username;
    if (!isNullOrUndefined(this.objUser.profilePicUrl) && this.objUser.profilePicUrl !== '') {
      this.txtSrcProfileImage = this.global.fn_imageURL(this.objUser.profilePicUrl);
      console.log('loadUserDetails: picURL=> ', this.txtSrcProfileImage);
    }
    this.txtName = isNullOrUndefined(this.objUser.name) ? '' : this.objUser.name;
    this.txtEmail = isNullOrUndefined(this.objUser.email) ? '' : this.objUser.email;
    this.ref.detectChanges();
  }

  updateProfileStart() {
    console.log('=> updateProfile', this.objUser.id);
    console.log('txtName =>', this.txtName);
    console.log('txtUsername =>', this.txtUsername);
    console.log('txtEmail =>', this.txtEmail);
    this.profileSectionChanged = this.checkProfileSectionChanges();

    if (this.imageChanged === true) {
      this.updateProfilePic();
    } else {
      const formData = new FormData();
      formData.append('id', this.objUser.id.toString());
      formData.append('username', this.txtUsername);
      formData.append('email', this.txtEmail);
      formData.append('name', this.txtName);
      formData.append('action', 'update_user');
      this.updateProfileSection(formData);
    }

  }

  checkProfileSectionChanges() {
    if (this.objUser.username !== this.txtUsername) {
      console.log(this.objUser.username, ' != ', this.txtUsername);
      this.noChanges = false;
      return true;
    }
    if (this.objUser.name !== this.txtName) {
      console.log(this.objUser.name, ' != ', this.txtName);
      this.noChanges = false;
      return true;
    }
    if (this.objUser.email !== this.txtEmail) {
      console.log(this.objUser.email, ' != ', this.txtEmail);
      this.noChanges = false;
      return true;
    }
    this.noChanges = true;
    return false;
  }

  async updateProfileSection(formData: FormData) {
    const loading = await this.loadingController.create({
      message: 'Updating Profile...',
    });

    await loading.present();


    // this.http.post("http://localhost:8888/upload.php", formData)
    this.http.post(this.global.fn_ApiURL('user'), formData)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe(res => {
        console.log('upload profile with image=> ', res);
        if (res['status']) {
          this.presentToast('Profile with photo update complete.');
          // this.toastController.dismiss().then(() => {
          // this.router.navigateByUrl('/start/tabs/posts');
          this.router.navigateByUrl('/start/tabs/profile');

          // this.toLogin();
          // });
        } else {
          this.presentToast('Profile with photo update failed.');
        }
      });

  }


  // Functions that deals with Images
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
      this.updatePicView();

    });
  }

  async invalidFileAlertPrompt(msg) {
    const alert = await this.alertController.create({
      header: 'Insert Photo',
      subHeader: 'Unsuccessful',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }

  updatePicView() {
    this.txtSrcProfileImage = this.objTempImage.path;
    this.noChanges = false;
    this.imageChanged = true;
    this.ref.detectChanges(); // trigger change detection cycle
  }

  updateProfilePic() {
    console.log('=> updateProfilePic');

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
      formData.append('image_profile', imgBlob, file.name);

      if (this.profileSectionChanged) {
        formData.append('id', this.objUser.id.toString());
        formData.append('username', this.txtUsername);
        formData.append('email', this.txtEmail);
        formData.append('name', this.txtName);
        formData.append('action', 'update_user_profile_all');
      } else {
        formData.append('username', this.objUser.username);
        formData.append('action', 'update_user_profile_pic');
      }

      this.uploadImageData(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  async uploadImageData(formData: FormData) {
    const loading = await this.loadingController.create({
      message: 'Updating Profile...',
    });

    await loading.present();
    console.log('check complete');

    // this.http.post("http://localhost:8888/upload.php", formData)
    this.http.post(this.global.fn_ApiURL('user'), formData)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe(res => {
        console.log('upload profile with image=> ', res);
        if (res['status']) {
          this.presentToast('Profile with photo update complete.')
          // this.toastController.dismiss().then(() => {
            this.router.navigateByUrl('/start/tabs/profile');
          // this.toLogin();
          // });
        } else {
          this.presentToast('Profile with photo update failed.')
        }
      });

  }

}
