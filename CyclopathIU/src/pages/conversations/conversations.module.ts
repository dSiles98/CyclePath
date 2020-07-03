import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConversationsPage } from './conversations';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    ConversationsPage,
  ],
  imports: [
    IonicPageModule.forChild(ConversationsPage),
    TranslateModule.forChild(),
  ],
})
export class ConversationsPageModule {
  constructor(public translatemodule: TranslateModule) {
  }
}
