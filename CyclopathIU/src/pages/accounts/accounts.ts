import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { AccountPage } from '../account/account';
import { FriendShip } from '../../models/FriendShip';
import { FriendsProvider } from '../../providers/friends/friends';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-accounts',
  templateUrl: 'accounts.html',
})
export class AccountsPage {
  searchTerm: string = '';
  accounts: any;
  friends: any;
  items: any;
  toast: any;
  searchControl: FormControl;
  message;

  /**
   * Constructor
   * @param navCtrl 
   * @param navParams 
   * @param friendServ 
   * @param toastCtrl 
   * @param userServ 
   */
  constructor(public navCtrl: NavController, public navParams: NavParams, public friendServ: FriendsProvider, private toastCtrl: ToastController, public userServ: UsersProvider, public translate: TranslateService) {
    this.accounts = [];
    this.items = [];
    this.friends = []
    userServ.getUsers().subscribe(response => {
      this.items = response;
      this.accounts = response;
    });
    friendServ.getFriends(localStorage.getItem('user')).subscribe(response => {
      this.friends = response;
    });
    this.searchControl = new FormControl();

    this.translate.get("FRIENDADDEDMESSAGE").subscribe(translated => { this.message = translated });
    this.toast = this.toastCtrl.create({
      message: this.message,
      duration: 1000,
      position: 'top'
    });

    this.toast.onDidDismiss(() => {
      this.navCtrl.pop();
    });
  }

  /**
   * this method set the filtered accounts when the page is loaded
   */
  ionViewDidLoad() {
    this.setFilteredItems();
    this.searchControl.valueChanges.subscribe(search => {
      this.setFilteredItems();
    });
  }

  /**
   * this method set the accounts to the new filtered accounts
   */
  setFilteredItems() {
    this.accounts = this.filterItems(this.searchTerm);
  }

  /**
   * this method send to the profile page of a user
   * @param username 
   */
  GotoProfile(username) {
    this.navCtrl.push(AccountPage, {username: username.username, isFriend: false});
  }

  /**
   * this method add a new friend to the list of friends
   * @param account 
   */
  addFriend(account) {
    let friendship: FriendShip = new FriendShip();
    friendship.idOwner = localStorage.getItem('user');
    friendship.idFriend = account;
    this.friendServ.postFriendShip(friendship).subscribe(response => {
      this.toast.present();
    });
  }

  /**
   * this method filter the users by parameters passed to the search bar
   * @param searchTerm 
   */
  filterItems(searchTerm) {
    return this.items.filter((item) => {
      return item.username.toLowerCase().indexOf(
        searchTerm.toLowerCase()) > -1;
    });
  }

  /**
   * this method if the account is mine the return a css object to block the display of that card
   * @param account 
   */
  isNotMe(account)
  {
    if (account.username == localStorage.getItem('user') || this.isFriend(account)) {
      return { 'display': 'none'}
    }
  }

  /**
   * this method return if the account is already a friend
   * @param account 
   */
  isFriend(account) {
    let result: boolean;
    result = false;
    for (let friend of this.friends) {
      if(friend.idFriend == account.username)
      {
        result = true;
      }
    }
    return result;
  }
}
