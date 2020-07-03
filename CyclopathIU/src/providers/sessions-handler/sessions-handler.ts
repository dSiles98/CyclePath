import { Injectable } from '@angular/core';
import { AppConfigurations } from '../../assets/configuration';
import { HubConnectionBuilder, HubConnection, IHttpConnectionOptions } from '@aspnet/signalr';
import { Observable, Subject } from 'rxjs';
import { MessageSessionHandler, ServerMethods, ClientMethods } from '../../models/session-handler';


@Injectable()
export class SessionsHandlerProvider {
  public ws: string;
  public token: string;
  public connection: HubConnection;
  public receiveNotificationOfClose: Subject<MessageSessionHandler> = new Subject<MessageSessionHandler>();

  constructor() {
    this.ws = new AppConfigurations().ws + 'sessions-handler';
    this.connection = null;
  }

  sendNotificationOfClose(message: MessageSessionHandler): Promise<any> {
    return new Promise((resolve, reject) =>{
      let username: string = localStorage.getItem('user');
      console.log('params', ServerMethods.CLOSE_SESSIONS, ClientMethods.CLOSE_ACCOUNT, message)
      this.connection.invoke(ServerMethods.CLOSE_SESSIONS, ClientMethods.CLOSE_ACCOUNT, message).then(response => {
        console.log('Message Has Been Send');
        resolve(response);
      }).catch(error => {
        reject(error);
        console.log(error);
      }); 
    });
  }

  startConnection(): any {
    this.token = localStorage.getItem('token');
    this.connection = new HubConnectionBuilder().withUrl(this.ws,
      { accessTokenFactory: () => `${this.token}` } as IHttpConnectionOptions).build();
    this.connection.start().then(() => //connection.invoke("send", "Hello")
      console.log('connected')
    );
    this.connection.on(ClientMethods.CLOSE_ACCOUNT, (response) => {
      console.log('close response', response);
      this.receiveNotificationOfClose.next(response);
    });
  }

  endConnection(): any {
    //this.connection.off('DeleteAccount');
    if (this.connection) {
      this.connection.stop().then(() =>
        console.log('disconnected')
      );
      this.connection = null;
    }
  }

}
