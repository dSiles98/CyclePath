import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateRentPointPage } from './create-rent-point';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentsModule } from '../../components/components.module';
@NgModule({
  declarations: [
    CreateRentPointPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateRentPointPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [CreateRentPointPage]
})

export class CreateRentPointPageModule {
  constructor(public translatemodule: TranslateModule) {
  }
}
