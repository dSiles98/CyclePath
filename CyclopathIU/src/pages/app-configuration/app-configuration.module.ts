import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppConfigurationPage } from './app-configuration';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule} from '@ngx-translate/core';

@NgModule({
  declarations: [
    AppConfigurationPage,
  ],
  imports: [
    IonicPageModule.forChild(AppConfigurationPage),
    TranslateModule.forChild(),
    ComponentsModule
  ],
  exports: [
    AppConfigurationPage
  ]
})
export class AppConfigurationPageModule {
  constructor(public translatemodule: TranslateModule) {
  }
}
