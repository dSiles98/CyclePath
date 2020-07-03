import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AccountsPage } from './accounts';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    AccountsPage,
  ],
  imports: [
    IonicPageModule.forChild(AccountsPage),
    TranslateModule.forChild(),
  ],
  exports: [
    AccountsPage
  ]
})
export class AccountsPageModule {
  constructor(public translatemodule: TranslateModule) {
  }
}
