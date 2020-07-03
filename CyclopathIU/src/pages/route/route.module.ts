import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RoutePage } from './route';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    RoutePage,
  ],
  imports: [
    IonicPageModule.forChild(RoutePage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    RoutePage
  ]
})
export class RoutePageModule {
  constructor(public translatemodule: TranslateModule) {
  }
}
