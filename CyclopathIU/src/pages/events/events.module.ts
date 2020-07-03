import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EventsPage } from './events';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    EventsPage,
  ],
  imports: [
    IonicPageModule.forChild(EventsPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    EventsPage
  ]
})
export class EventsPageModule {
  constructor(public translatemodule: TranslateModule) {
  }
}
