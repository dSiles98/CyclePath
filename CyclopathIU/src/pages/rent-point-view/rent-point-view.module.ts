import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RentPointViewPage } from './rent-point-view';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [
    RentPointViewPage,
  ],
  imports: [
    IonicPageModule.forChild(RentPointViewPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    RentPointViewPage
  ]
})
export class RentPointViewPageModule {
  constructor(public translatemodule: TranslateModule) {
  }
}
