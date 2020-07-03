import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BlocksProvider } from '../../providers/blocks/blocks';
import { UsersProvider } from '../../providers/users/users';
/**
 * Generated class for the BlocksPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-blocks',
  templateUrl: 'blocks.html',
})
export class BlocksPage {
  private accounts: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public blockServ: BlocksProvider, public accountServ: UsersProvider) {
    this.accounts = [];
  }

  ionViewDidLoad() {
    let me = localStorage.getItem("userId");
    this.blockServ.getBlocks(me).subscribe((res: Array<any>) => {
      for (let i = 0; i < res.length; i++) {
        this.addInAccouts(res[i].idBlocked, res[i].id);
      }
    });
  }
  addInAccouts(idUser, idBlock) {
    this.accountServ.getUserById(idUser).subscribe((res:any) => {
      res.idBlock = idBlock;
      res.visible = true;
      this.accounts.push(res);
    });
  }

  unBlock(account) {
    this.blockServ.deleteBlock(account.idBlock).subscribe(res => {
      account.visible = false;
    });
  }
}
