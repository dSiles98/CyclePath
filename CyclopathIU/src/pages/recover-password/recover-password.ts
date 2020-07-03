import { Component } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UsersProvider } from '../../providers/users/users';
import { NavController } from '../../../node_modules/ionic-angular';


@Component({
  selector: 'page-recover-password',
  templateUrl: 'recover-password.html',
})
export class RecoverPasswordPage {
    public validator : FormGroup;	
    
    /**
     * Constructor
     * @param formBuilder 
     */
    constructor(public formBuilder: FormBuilder, public userProvider: UsersProvider, public navCtrl: NavController) {
      this.validator = this.formBuilder.group({
        username: ['', Validators.compose([Validators.email, Validators.required])],
      });
    }
    
    /**
     * this method recover the password of a user by his username and pop to login
     */
    public recoverPassword() {
      this.userProvider.recoverPassword(this.validator.get('username').value).subscribe();
      this.navCtrl.pop();
    }
}