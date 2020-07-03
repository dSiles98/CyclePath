import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllRoutesPage } from './all-routes';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    AllRoutesPage,
  ],
  imports: [
    IonicPageModule.forChild(AllRoutesPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    AllRoutesPage
  ]
})
export class AllRoutesPageModule {
  constructor(public translatemodule: TranslateModule) {
  }
}
