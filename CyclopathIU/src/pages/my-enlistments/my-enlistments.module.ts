import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyEnlistmentsPage } from './my-enlistments';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    MyEnlistmentsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyEnlistmentsPage),
    ComponentsModule,
    TranslateModule.forChild()
  ],
})
export class MyEnlistmentsPageModule {
  constructor(public translatemodule: TranslateModule) {
  }
}
