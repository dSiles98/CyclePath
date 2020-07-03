import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangePasswordPage } from './change-password';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '../../../node_modules/@ngx-translate/core';

@NgModule({
  declarations: [
    ChangePasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ChangePasswordPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    ChangePasswordPage
  ]
})
export class ChangePasswordPageModule {
  constructor(tranlateModule: TranslateModule) {}
}
