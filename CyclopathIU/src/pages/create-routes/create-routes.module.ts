import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateRoutesPage } from './create-routes';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    CreateRoutesPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateRoutesPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [CreateRoutesPage],
  entryComponents: [
  ]
})
export class CreateRoutesPageModule {
  constructor(public translatemodule: TranslateModule) {
  }
}
