import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RentPointPage } from './rent-point';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [
    RentPointPage,
  ],
  imports: [
    IonicPageModule.forChild(RentPointPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
})
export class RentPointPageModule {
  constructor(public translatemodule: TranslateModule) {
  }
}
