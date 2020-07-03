import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, DateTime } from 'ionic-angular';
import { MessagesProvider } from '../../providers/messages/messages';
import { Message } from '../../models/message';
import { Account } from '../../models/account';
import { UsersProvider } from '../../providers/users/users';
import { AccountPage } from '../account/account';
import { FriendsProvider } from '../../providers/friends/friends';
import { FriendShip } from '../../models/FriendShip';
import { BlocksProvider } from '../../providers/blocks/blocks';
import { TranslateService } from '@ngx-translate/core';


@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  private account: Account;
  private messages: Array<any>;
  private message: string;
  private interval: any;
  public isFriend: boolean;
  public isBlocked: boolean;

  constructor(public translate: TranslateService,public navCtrl: NavController, public friendsServ: FriendsProvider, public userServ: UsersProvider,
    public navParams: NavParams, private toastCtrl: ToastController, private messageServ: MessagesProvider,
    public blockServ: BlocksProvider, private alertCtrl: AlertController) {
    this.isFriend = true;
    this.isBlocked = false;
    this.messages = [];
  }

  /**
  * update the message in a interval
  * */
  ionViewDidLoad() {
    this.account = this.navParams.get('account');
    this.getMessages();
    this.setIsFriend();
    this.setIsBlocked();
    this.interval = setInterval(() => {
      this.getMessages();
    }, 2700);
  }

  ionViewWillLeave() {
    clearInterval(this.interval);
  }

  /** block the current account with whom is chating the user */
  blockUser() {
    var value = { title: ""};
    var confirm;
    var cancel;
    this.translate.get("BLOCKUSER").subscribe(translated => { value.title = translated });
    this.translate.get("BLOCK").subscribe(translated => { confirm = translated });
    this.translate.get("CANCEL").subscribe(translated => { cancel = translated });

    let alert = this.alertCtrl.create({
      title: value.title,
      buttons: [
        {
          text: cancel,
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: confirm,
          handler: data => {
            let me = localStorage.getItem('userId');
            let dataObj = { idOwner: me, idBlocked: this.account.id };
            this.blockServ.postBlock(dataObj).subscribe(res => {
              this.isBlocked = true;
            });
          }
        }
      ]
    });
    alert.present();
  }

  /** set the atribute isFriend after search in the friendslist */
  setIsFriend() {
    let me = localStorage.getItem('user');
    this.friendsServ.getFriends(me).subscribe((response: Array<FriendShip>) => {
      this.isFriend = response.some(e => e.idFriend === this.account.username);
    });
  }
  setIsBlocked() {
    let me = localStorage.getItem('userId');
    this.blockServ.getBlocks(me).subscribe((response: Array<any>) => {
      this.isBlocked = response.some(e => e.idBlocked === this.account.id);
    });
  }

  /**
   * Send to the profile of the other user in the chat.
   * 
   */
  GotoProfile() {
    this.navCtrl.push(AccountPage, { username: this.account.username, isFriend: this.isFriend });

  }

   /**send a message to the contact */
  sendMessage() {
    var message;
    this.translate.get("MESSAGEBLOCK").subscribe(translated => { message = translated });
    let newMessage = new Message();
    newMessage.addressee = this.account.id;
    newMessage.content = this.message;
    newMessage.ownerId = parseInt(localStorage.getItem('userId'));
    this.messageServ.sendMessage(newMessage).subscribe(response => {
      this.message = '';
    },
      (error) => {
        this.showToast(message);

      });
    this.getMessages();
  }

  /** get the new messages */
  getMessages() {
    let me = parseInt(localStorage.getItem('userId'));
    let friend = this.account.id;
    this.messageServ.getMessages(friend, me).subscribe((response: Array<Message>) => {
      this.checkMessage(response);
      this.messageServ.getMessages(me, friend).subscribe((response: Array<Message>) => {
        this.checkMessage(response);
        this.messages.sort(function (a, b) { return a.id - b.id });
      });
    });
  }

  /**
   * check if the message is new and update the delivered info of the message
   * @param messages the new incomming messages
   */
  checkMessage(messages: Array<Message>) {
    let me = parseInt(localStorage.getItem('userId'));
    for (let i = 0; i < messages.length; i++) {
      messages[i].sendTime = new Date(`${messages[i].sendTime}+0000`).toISOString();
      if (!this.messages.some(e => e.id === messages[i].id)) {
        this.messages.push(messages[i]);
      } else {
        this.messages.filter(e => e.id === messages[i].id)[0].delivered = messages[i].delivered;
      }
      if (!messages[i].delivered && messages[i].ownerId != me) {
        this.messageServ.setMessageDelivered(messages[i].id, 0).subscribe();
      }
    }
  }

  showToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }
}
