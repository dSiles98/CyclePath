import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AccountPage } from '../account/account';
import { FriendsProvider } from '../../providers/friends/friends';
import { UsersProvider } from '../../providers/users/users';
import { AccountsPage } from '../accounts/accounts';
import { ChatPage } from '../chat/chat';


@IonicPage()
@Component({
  selector: 'page-my-friends',
  templateUrl: 'my-friends.html',
})
export class MyFriendsPage {

  searchTerm: string = '';
  accounts: any;
  toast: any;

  /**
   * Contructor
   * @param navCtrl 
   * @param navParams 
   * @param friendServ 
   * @param userServ 
   */
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public friendServ: FriendsProvider,
    public userServ: UsersProvider) {
    this.accounts = [];
  }

  /**
   * Get the list of my friend when the page is in front page
   */
  ionViewDidEnter() {
    this.friendServ.getFriends(localStorage.getItem('user')).subscribe(response => {
      this.accounts = response;
    });
  }

  /**
   * Send to selected profile
   * @param username 
   */
  GotoProfile(username) {
    this.userServ.getUser(username).subscribe((response: any) => {
      this.navCtrl.push(AccountPage, {username: response.username, isFriend: true});
    });
    
  }

  /**
   * Send to the chat with the selected friend
   * @param username 
   */
  GotoChat(username) {
    this.userServ.getUser(username).subscribe((response: any) => {
      this.navCtrl.push(ChatPage, { account: response});
    });
  }

  /**
   * Send to accounts page
   */
  changeSearch() {
    this.navCtrl.push(AccountsPage);
  }
}
