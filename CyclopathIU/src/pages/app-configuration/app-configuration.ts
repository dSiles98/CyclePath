import { Component } from '@angular/core';
import {HomePage} from '../home/home';
import { IonicPage, NavController, NavParams, ToastController, AlertController, Toast } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { ConfigProvider } from '../../providers/config/config';
import { TranslateService } from '@ngx-translate/core';
import { IPatch } from '../../models/patch';
import { SessionsHandlerProvider } from '../../providers/sessions-handler/sessions-handler';
import { MessageSessionHandler } from '../../models/session-handler';


@IonicPage()
@Component({
  selector: 'page-app-configuration',
  templateUrl: 'app-configuration.html',
})
export class AppConfigurationPage {
  toast: Toast;
  theme: string;
  lenguage: string;

  constructor(public navCtrl: NavController, public ConfigProv: ConfigProvider, public navParams: NavParams, public toastCtrl: ToastController,
    public alertCtrl: AlertController, public userServ: UsersProvider, private translate: TranslateService, public sessionsHandler: SessionsHandlerProvider) {
    this.ConfigProv.getActiveTheme().subscribe(value => this.theme = value);
    this.ConfigProv.getActiveLanguage().subscribe(value => this.lenguage = value);
  }

  toggleAppTheme() {
    this.ConfigProv.setActiveTheme(this.theme);
    localStorage.setItem('theme', this.theme);
    let patchTheme: IPatch = {
      op: 'replace',
      path: '/themeId',
      value: this.theme,
    };
    var patchOperations = [patchTheme];
    var username = localStorage.getItem('user');
    this.userServ.patchAccount(username, patchOperations).subscribe();
  }

  changeAppLanguage() {
    this.ConfigProv.setActiveLanguage(this.lenguage);
    localStorage.setItem('language', this.lenguage);
    if(this.lenguage === 'spanish') {
      this.translate.use('es');
    } else {
      this.translate.use('en');
    }
    let patchTheme: IPatch = {
      op: 'replace',
      path: '/languageid',
      value: this.lenguage,
    };
    var patchOperations = [patchTheme];
    var username = localStorage.getItem('user');
    this.userServ.patchAccount(username, patchOperations).subscribe();
  }

  presentPrompt() {
    let message;
    let password;
    let cancel;
    let del;
    let confirm;
    this.translate.get('DELETEACCOUNTMESSAGE').subscribe(value => message = value);
    this.translate.get('PASSWORD').subscribe(value => password = value);
    this.translate.get('CANCEL').subscribe(value => cancel = value);
    this.translate.get('DELETE').subscribe(value => del = value);
    this.translate.get('CONFIRM').subscribe(value => confirm = value )
    this.toast = this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'top'
    });
    this.toast.onDidDismiss(() => {
      this.navCtrl.setRoot(HomePage)
      localStorage.clear();
    });
    let alert = this.alertCtrl.create({
      title: confirm,
      inputs: [
        {
          name: 'password',
          placeholder: password,
          type: 'password'
        }
      ],
      buttons: [
        {
          text: cancel,
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: del,
          handler: data => {
            this.userServ.deleteUser(localStorage.getItem('user'),data.password).subscribe(data => {
              this.sessionsHandler.sendNotificationOfClose(MessageSessionHandler.DELETE_ACCOUNT).then((resolve) =>{
                this.sessionsHandler.endConnection();
              });
            });
            this.toast.present();
          }
        }
      ]
    });
    alert.present();
  }
}
