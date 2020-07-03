import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {SignupPage} from '../signup/signup';
import { LoginPage } from '../login/login';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  /**
   * Constructor
   * @param navCtrl 
   */
  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  /**
   * send to the sign up page
   */
  goToSingUp() {
    this.navCtrl.push(SignupPage);
  }

  /**
   * send  to the login page
   */
  goToLogin() {
    this.navCtrl.push(LoginPage);
  }
}
