import { Component } from '@angular/core';
import { IonicPage, ToastController, NavController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersProvider } from '../../providers/users/users';
import { IAccount } from '../../models/account';
import { RentPointsPage } from '../rent-points/rent-points';


@IonicPage()
@Component({
  selector: 'page-edit-account',
  templateUrl: 'edit-account.html',
})
export class EditAccountPage {
  private validator: FormGroup;
  toast: any;

  /**
   * Constructor
   * @param userServ 
   * @param toastCtrl 
   * @param formBuilder 
   * @param navController 
   */
  constructor(public userServ: UsersProvider,
    private toastCtrl: ToastController,
    private formBuilder: FormBuilder,
    public navController: NavController) {
    this.validator = this.formBuilder.group({
      name: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      email: ['', Validators.compose([Validators.email, Validators.required])],
      lastname: ['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      birthday: [new Date(), Validators.compose([Validators.required])]
    })
    this.userServ.getUser(localStorage.getItem("user")).subscribe((data: IAccount) => {
      let birthday;
      this.validator.controls['name'].setValue(data.name);
      this.validator.controls['lastname'].setValue(data.lastname);
      this.validator.controls['email'].setValue(data.email);
      birthday = new Date(data.birthday).toISOString().split('T', 1);
      this.validator.controls['birthday'].setValue(birthday[0]);
    });
  }

  /**
   * This method edit an account
   */
  clickEdit() {
    this.toast = this.toastCtrl.create({
      message: 'Account eddited successfully',
      duration: 1000,
      position: 'top'
    });

    this.toast.onDidDismiss(() => {
      this.navController.setRoot(RentPointsPage)
    });
    this.userServ.putUsers(this.validator.value, localStorage.getItem("user")).subscribe((data: IAccount) => {
      
      this.toast.present();
    });
  }
}
