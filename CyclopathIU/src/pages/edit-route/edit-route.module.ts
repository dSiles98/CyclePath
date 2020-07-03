import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditRoutePage } from './edit-route';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    EditRoutePage,
  ],
  imports: [
    IonicPageModule.forChild(EditRoutePage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    EditRoutePage
  ]
})
export class EditRoutePageModule {
  constructor(public translatemodule: TranslateModule) {
  }
}
