import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddNewBikePage } from './add-new-bike';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [
    AddNewBikePage,
  ],
  imports: [
    IonicPageModule.forChild(AddNewBikePage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    AddNewBikePage
  ]
})
export class AddNewBikePageModule {
  constructor(public translatemodule: TranslateModule) {
  }
}
