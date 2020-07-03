import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoutesPage } from './routes';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    RoutesPage,
  ],
  imports: [
    IonicPageModule.forChild(RoutesPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    RoutesPage
  ]
})
export class RoutesPageModule {
  constructor(public translatemodule: TranslateModule) {
  }
}
