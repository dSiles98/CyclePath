import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventPage } from './event';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';


@NgModule({
  declarations: [
    EventPage,
  ],
  imports: [
    IonicPageModule.forChild(EventPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [EventPage]
})
export class EventPageModule {
  constructor(public translatemodule: TranslateModule) {
  }
}
