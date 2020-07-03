import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { UsersProvider } from '../../providers/users/users';
import { Account } from '../../models/account';
import { FriendsProvider } from '../../providers/friends/friends';
import { FriendShip } from '../../models/FriendShip';
import { ToastController } from 'ionic-angular';
import { MyFriendsPage } from '../my-friends/my-friends';
import { RoutesProvider } from '../../providers/routes/routes';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  userRating: Array<{ title: string, count: number }>;
  account: Account;
  toast: any;
  message
  
  /*
  * Contructor
  */
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public friendServ: FriendsProvider,
    public routesServ: RoutesProvider,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public userServ: UsersProvider,
    public translate: TranslateService) {
    this.account = new Account();
    this.userRating = [
      { title: 'ROUTES', count: 0 },
      { title: 'FRIENDS', count: 0 }
    ];
    userServ.getUser(navParams.get('username')).subscribe((data: Account) => {
      this.account.username = data.username;
      this.account.name = data.name;
      this.account.lastname = data.lastname;
      this.account.birthday = data.birthday;
      this.routesServ.getRoutesOf(this.account.username).subscribe((data: Array<any>) => {
        this.userRating[0].count = data.length;
      });
      this.friendServ.getFriends(this.account.username).subscribe((data: Array<any>) => {
        this.userRating[1].count = data.length;
      });
    });

    this.translate.get("FRIENDADDEDMESSAGE").subscribe(translated => { this.message = translated });
    this.toast = this.toastCtrl.create({
      message: this.message,
      duration: 1000,
      position: 'top'
    });

    this.toast.onDidDismiss(() => {
      this.navCtrl.push(MyFriendsPage);
    });
  }

  /*
   * this method add a friend.
   */
  addFriend() {
    let friendship: FriendShip = new FriendShip();
    friendship.idOwner = localStorage.getItem('user');
    friendship.idFriend = this.account.username;
    this.friendServ.postFriendShip(friendship).subscribe(response => {
      this.toast.present();
    });
  }

  /*
   * this method delete a friend.
   */
  deleteFriend() {
    var value = { title: "", message: "" };
    var confirm;
    var cancel;
    this.translate.get("DELETEFRIEND").subscribe(translated => { value.title = translated });
    this.translate.get("DELETEFRIENDMESSAGE").subscribe(translated => { value.message = translated });
    this.translate.get("CONFIRM").subscribe(translated => { confirm = translated });
    this.translate.get("CANCEL").subscribe(translated => { cancel = translated });
    let alert = this.alertCtrl.create({
      title: value.title,
      message: value.message,
      buttons: [
        {
          text: cancel,
          role: 'cancel',
        },
        {
          text: confirm,
          handler: () => {
            this.friendServ.getFriends(localStorage.getItem('user')).subscribe((response: Array<FriendShip>) => {
              let idfriendship = this.filterItems(response, this.account.username)[0].id;
              this.endFriendship(idfriendship);
            });
          }
        }
      ]
    });
    alert.present();
    
  }

  /**
   * call the service to remove the friendship in the DB.
   * */
  private endFriendship(id:number) {
    this.friendServ.deleteFriendShip(id).subscribe(response => {
      this.navCtrl.push(MyFriendsPage);
    });
  }

  /**
   * this method filter the friends
   * @param searchTerm 
   */
  filterItems(friendships: Array<FriendShip>, searchTerm: string) {
    
    return friendships.filter((item) => {
      return item.idFriend.toLowerCase() == searchTerm.toLowerCase();
    });
  }

  /*
   * this method return if the account page is from a friend or not
   */
  isFriend() {
    return this.navParams.get('isFriend')
  }
}
