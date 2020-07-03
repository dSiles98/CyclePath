import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyRentPointsPage } from './my-rent-points';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MyRentPointsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyRentPointsPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    MyRentPointsPage
  ]
})
export class MyRentPointsPageModule {
  constructor(public translatemodule: TranslateModule) {
  }
}
