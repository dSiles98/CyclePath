import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateEventPage } from './create-event';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    CreateEventPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateEventPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [CreateEventPage]
})
export class CreateEventPageModule {
  constructor(public translatemodule: TranslateModule) {
  }
}
