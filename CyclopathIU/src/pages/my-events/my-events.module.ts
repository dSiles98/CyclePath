import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyEventsPage } from './my-events';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core'

@NgModule({
  declarations: [
    MyEventsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyEventsPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    MyEventsPage
  ]
})
export class MyEventsPageModule {
  constructor(public translatemodule: TranslateModule) {
  }
}
