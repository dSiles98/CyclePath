import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyFriendsPage } from './my-friends';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    MyFriendsPage,
  ],
  imports: [
    IonicPageModule.forChild(MyFriendsPage),
    TranslateModule.forChild(),
  ],
  exports: [
    MyFriendsPage
  ]
})
export class MyFriendsPageModule {
  constructor(public translatemodule: TranslateModule) {
  }
}
