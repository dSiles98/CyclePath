import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, PanGesture } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { RecoverPasswordPage } from '../recover-password/recover-password';
import { Md5 } from 'ts-md5/dist/md5';
import {AuthenticationProvider} from '../../providers/authentication/authentication';
import { RentPointsPage } from '../rent-points/rent-points';
import { ConfigProvider } from '../../providers/config/config';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';
import { SessionsHandlerProvider } from '../../providers/sessions-handler/sessions-handler';
import { UsersProvider } from '../../providers/users/users';
import { Account } from '../../models/account';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private validator: FormGroup;	
  
  /**
   * Constructor
   * @param navCtrl 
   * @param formBuilder 
   * @param authProvider 
   */
  constructor(public navCtrl: NavController, public ConfigProv: ConfigProvider, public navParams: NavParams,
    public toastCtrl: ToastController, public formBuilder: FormBuilder, public authProvider: AuthenticationProvider,
    public usersProvider: UsersProvider,
    private translate: TranslateService, public sessionsHandler: SessionsHandlerProvider) {
    this.validator = this.formBuilder.group({
      username: ['', Validators.compose([Validators.required])],
      password: ['',Validators.compose([Validators.required])]
    });
  }

  /**
   * send to the recover password page
   */
  goToRecoverPassword() {
    this.navCtrl.push(RecoverPasswordPage);
  }

  /**
   * get a token from the server using the authentication provider
   */
  async login() {
    let toast: any;
    let message: string;
    let token: any;
    let username: string;
    this.validator.value.password = Md5.hashStr(this.validator.get('password').value);
    await this.authProvider.login(this.validator).toPromise().then(async(response: Response) => {
      token = response[0];
      username = this.validator.get('username').value;
      this.authProvider.Tokken = token;
      await localStorage.setItem('token', token);
      await this.usersProvider.getUser(username).subscribe((response:Account) => {
        localStorage.setItem('nameUser', response.name);
        localStorage.setItem('lastname', response.lastname);
        localStorage.setItem('userId', response.id.toString());     
      },(error) => {
        console.log('error', 'user do not found', error);
      });
      localStorage.setItem('user', username);
      localStorage.setItem('logged', 'true');
      localStorage.setItem('theme', response[1]);
      localStorage.setItem('language', response[2]);
      this.ConfigProv.setActiveTheme(response[1]);
      this.ConfigProv.setActiveLanguage(response[2]);
      response[2] === 'spanish'? this.translate.use('es'): this.translate.use('en');
      this.navCtrl.setRoot(RentPointsPage);
      this.sessionsHandler.startConnection();
    }).catch((error: Response) => {
      if (error.status === 401) {
        this.translate.get('WRONGPASSWORD').subscribe(value => message = value);
      } else if(error.status === 400) {
        this.translate.get('INVALIDUSERNAME').subscribe(value => message = value);
      }
      toast = this.toastCtrl.create({
        message: message,
        position: 'top',
        duration: 4000
      });
      toast.present();
    });
  }
}
