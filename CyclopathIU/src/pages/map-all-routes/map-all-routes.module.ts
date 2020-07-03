import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapAllRoutesPage } from './map-all-routes';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    MapAllRoutesPage,
  ],
  imports: [
    IonicPageModule.forChild(MapAllRoutesPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    MapAllRoutesPage
  ]
})
export class MapAllRoutesPageModule {
  constructor(public translatemodule: TranslateModule) { }
}
