import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModifyRentsPage } from './modify-rents';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    ModifyRentsPage,
  ],
  imports: [
    IonicPageModule.forChild(ModifyRentsPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    ModifyRentsPage
  ]
})
export class ModifyRentsPageModule {
  constructor(public translatemodule: TranslateModule) {
  }
}
