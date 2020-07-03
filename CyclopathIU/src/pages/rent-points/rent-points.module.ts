import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RentPointsPage } from './rent-points';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RentPointsPage,
  ],
  imports: [
    IonicPageModule.forChild(RentPointsPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [RentPointsPage],
})
export class RentPointsPageModule {
  constructor(public translatemodule: TranslateModule) {
  }
}
