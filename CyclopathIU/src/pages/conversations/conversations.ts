import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MessagesProvider } from '../../providers/messages/messages';
import { ChatPage } from '../chat/chat';
import { UsersProvider } from '../../providers/users/users';
import { SingletonProvider } from '../../providers/singleton/singleton';


@IonicPage()
@Component({
  selector: 'page-conversations',
  templateUrl: 'conversations.html',
})
export class ConversationsPage {
  conversations: Array<any>;
  private userId: number;
  constructor(public navCtrl: NavController, public singleton: SingletonProvider, public userServ: UsersProvider, public navParams: NavParams, public messageServ: MessagesProvider) {
    this.userId = parseInt(localStorage.getItem("userId"));
    this.messageServ.getConversationsStatus(this.userId).subscribe((response:Array<any>) => {
      this.conversations = response;
    });
  }
  

  /**
   * Send to the chat with the selected friend
   * @param username 
   */
  GotoChat(username) {
    this.userServ.getUser(username).subscribe((response: any) => {
      this.navCtrl.push(ChatPage, { account: response });
    });
  }

}
