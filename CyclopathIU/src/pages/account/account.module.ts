import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountPage } from './account';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AccountPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountPage),
    TranslateModule.forChild(),
  ],
  exports: [
    AccountPage,
  ]
})
export class AccountPageModule {
  constructor(public translatemodule: TranslateModule) {
  }
}
