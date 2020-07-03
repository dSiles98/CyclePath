import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators, FormControl } from '../../../node_modules/@angular/forms';
import { UsersProvider } from '../../providers/users/users';
import { TranslateService } from '@ngx-translate/core';
import { HomePage } from '../home/home';



@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  validator: FormGroup;
  title: string = 'CHANGEPASSWORD'
  constructor(public navCtrl: NavController, public navParams: NavParams,  public formBuilder: FormBuilder, public userProv: UsersProvider, public toastCtrl: ToastController, private translate: TranslateService) {
    this.validator = this.formBuilder.group({
      password: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required),
      repeatPassword: new FormControl('', Validators.required),
    });
  }

  async changePassword () {
    let message: string;
    let toast: any;
    if(this.validator.get('newPassword').value === this.validator.get('repeatPassword').value) {
      await this.userProv.changePassword(localStorage.getItem('user'), this.validator.value).toPromise().then(() => {
        this.translate.get('PASSWORDCHANGED').subscribe(value => message = value);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        localStorage.removeItem('logged');
        this.navCtrl.setRoot(HomePage);
      }).catch( error => {
        if(this.validator.get('newPassword').value === '') {
          this.translate.get('PASSWORDEMPTY').subscribe(value => message = value);
        } else {
          this.translate.get('WRONGPASSWORD').subscribe(value => message = value);
        }
      });
    }
    else {
      this.translate.get('PASSWORDDOESNOTMATCH').subscribe(value => message = value);
    }
    toast = this.toastCtrl.create({
      message: message,
      duration: 4000,
      position: 'top'
    });
    toast.present();
  }
}
