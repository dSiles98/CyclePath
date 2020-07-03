import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditEventPage } from './edit-event';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    EditEventPage,
  ],
  imports: [
    IonicPageModule.forChild(EditEventPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [EditEventPage]
})
export class EditEventPageModule {
  constructor(public translatemodule: TranslateModule) {
  }
}
