import { Component } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { UsersProvider } from '../../providers/users/users';
import { IAccount } from '../../models/account';
import {NavController, ToastController} from 'ionic-angular';
import { TranslateService } from '../../../node_modules/@ngx-translate/core';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  public validator : FormGroup;	
    /**
     * Constructor
     * @param userServ 
     * @param formBuilder 
     * @param navController 
     */
  	constructor(public userServ: UsersProvider, private formBuilder: FormBuilder, public navController: NavController, public toastCtrl: ToastController, private translate: TranslateService) {
      this.validator = this.formBuilder.group({
        name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        email: ['', Validators.compose([Validators.email, Validators.required])],
        lastname: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
        username: ['', Validators.compose([Validators.maxLength(30), Validators.required])],
        birthday: [new Date(), Validators.required],
        password: ['',Validators.compose([Validators.maxLength(30), Validators.required])],
        confirmPassword: ['',Validators.compose([Validators.maxLength(30), Validators.required])]
      }, {validator: SignupPage.passwordsMatch});
    }
    
     /**
     * send the information of the user to the api.
     */
  async clickSignUp() {
    let account: IAccount;
    let toast: any;
    let message: string;
    account = { ...this.validator.value };
    account.birthday = new Date(account.birthday).toLocaleDateString();
    await this.userServ.postUser(account).toPromise().then(() => {
        this.translate.get('ACCOUNTCREATED').subscribe(value => message = value);
        this.navController.pop();
      }).catch( () => {
        this.translate.get('CREATEACCOUNTERROR').subscribe(value => message = value);
      });
      toast = this.toastCtrl.create({
        message: message,
        position: 'top',
        duration: 4000
      });
      toast.present();
  	}

    /**
     * compares the passwords.
     * @param {FormGroup} cg -.
     * @return {{[err: string]: any}} the list of numbers.
     */
    static passwordsMatch(fg: FormGroup): {[err: string]: any} {
      let pwd1 = fg.get('password');
      let pwd2 = fg.get('confirmPassword');
      let rv: {[error: string]: any} = {};
      if ((pwd1.touched || pwd2.touched) && pwd1.value !== pwd2.value) {
        rv['passwordMismatch'] = true;
      }
      return rv;
    }

}
