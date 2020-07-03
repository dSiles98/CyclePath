import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditAccountPage } from './edit-account';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    EditAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(EditAccountPage),
    TranslateModule.forChild(),
  ],
  exports: [
    EditAccountPage,
  ]
})
export class EditAccountPageModule {
  constructor(public translatemodule: TranslateModule) {
  }
}
