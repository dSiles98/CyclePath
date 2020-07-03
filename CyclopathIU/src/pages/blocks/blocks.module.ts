import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BlocksPage } from './blocks';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    BlocksPage,
  ],
  imports: [
    IonicPageModule.forChild(BlocksPage),
    TranslateModule.forChild()
  ],
})
export class BlocksPageModule {
  constructor(public translatemodule: TranslateModule) {

  }
}
