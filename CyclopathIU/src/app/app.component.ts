import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, ToastController } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
import { MyRentPointsPage } from '../pages/my-rent-points/my-rent-points';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RentPointsPage } from '../pages/rent-points/rent-points';
import { EditAccountPage } from '../pages/edit-account/edit-account';
import { UsersProvider } from '../providers/users/users';
import { MyFriendsPage } from '../pages/my-friends/my-friends';
import { FriendsProvider } from '../providers/friends/friends';
import { RoutesPage } from '../pages/routes/routes';
import { MyEventsPage } from '../pages/my-events/my-events';
import { EventsPage } from '../pages/events/events';
import { AllRoutesPage } from '../pages/all-routes/all-routes';
import { ConversationsPage } from '../pages/conversations/conversations';
import { RoutesProvider } from '../providers/routes/routes';
import { SingletonProvider } from '../providers/singleton/singleton';
import { MessagesProvider } from '../providers/messages/messages';
import { TranslateService } from '@ngx-translate/core';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { AppConfigurationPage } from '../pages/app-configuration/app-configuration';
import { ConfigProvider } from '../providers/config/config';
import { BlocksPage } from '../pages/blocks/blocks';
import { MyEnlistmentsPage } from '../pages/my-enlistments/my-enlistments';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { ChatPage } from '../pages/chat/chat';
import { SessionsHandlerProvider } from '../providers/sessions-handler/sessions-handler';
import { MessageSessionHandler } from '../models/session-handler';
import { Subscription } from 'rxjs';
import { MapAllRoutesPage } from '../pages/map-all-routes/map-all-routes';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  visibleOption: string;
  rootPage: any;
  settings: Array<{ title: string, component: any, icon: string, alert: boolean }>;
  routes: Array<{ title: string, component: any, icon: string, alert: boolean }>;
  rentpoints: Array<{ title: string, component: any, icon: string, alert: boolean }>;
  community: Array<{ title: string, component: any, icon: string, alert: boolean }>;
  userRating: Array<{ title: string, count: number }>;
  selectedTheme: string;
  interval: any;
  username: string = localStorage.getItem('user');
  name: string = localStorage.getItem('nameUser');
  lastname: string = localStorage.getItem('lastname');
  notificationSubscription: Subscription;
  data = false;
  title: string = 'Cycle Path'

  constructor( public platform: Platform, public singleton: SingletonProvider, public configService: ConfigProvider,
    public menu: MenuController, public statusBar: StatusBar, public splashScreen: SplashScreen,
    public friendProvider: FriendsProvider, public routesServ: RoutesProvider,
    public messagesServ: MessagesProvider, private translate: TranslateService, private localNotifications: LocalNotifications,
    public sessionsHandler: SessionsHandlerProvider, public toastCtrl: ToastController) {
    this.configService.getActiveTheme().subscribe(value => this.selectedTheme =value);
    if (this.logged()) {
      this.sessionsHandler.startConnection();
      this.rootPage = RentPointsPage;
    } else {
      this.rootPage = HomePage;
    }
    this.username = localStorage.getItem('user');
    this.name = localStorage.getItem('nameUser');
    this.lastname = localStorage.getItem('lastname');
    this.initializeApp();
    this.singleton.setData([]);    
    this.rentpoints = [
      { title: 'RENTPOINTS', component: RentPointsPage, icon: 'pin', alert: false},
      { title: 'MYRENTPOINTS', component: MyRentPointsPage, icon: 'bicycle', alert: false },
    ];
    this.routes = [
      { title: 'MYROUTES', component: RoutesPage, icon: 'git-compare', alert: false },
      { title: 'ROUTES', component: MapAllRoutesPage, icon: 'git-branch', alert: false },
    ];
    this.community = [
      { title: 'CONVERSATIONS', component: ConversationsPage, icon: 'people', alert: false },
      { title: 'MYFRIENDS', component: MyFriendsPage, icon: 'contacts', alert: false },
      { title: 'COMMUNITYEVENTS', component: EventsPage, icon: 'people', alert: false },
      { title: 'MYENLISTMENTS', component: MyEnlistmentsPage, icon: 'people', alert: false },
      { title: 'MYEVENTS', component: MyEventsPage, icon: 'trophy', alert: false },
      { title: 'BLOCKS', component: BlocksPage, icon: 'contacts', alert: false },
    ];
    this.settings = [
      { title: 'APPSETTINGS', component: AppConfigurationPage, icon: 'settings', alert: false },
      { title: 'EDITACCOUNT', component: EditAccountPage, icon: 'create', alert: false },
      { title: 'CHANGEPASSWORD', component: ChangePasswordPage, icon: 'key', alert: false },
    ]
    this.userRating = [
      { title: 'ROUTES', count: 0 },
      { title: 'FRIENDS', count: 0 }
    ];
  }

  logged() {
    return localStorage.getItem('logged');
  }

  menuOpened() {
    this.username = localStorage.getItem('user');
    this.name = localStorage.getItem('nameUser');
    this.lastname = localStorage.getItem('lastname');
    console.log(this.username, this.name, this.lastname);
    if(this.logged()) {
      this.routesServ.getRoutesOf(this.username).subscribe((data: Array<any>) => {
        this.userRating[0].count = data.length;
      });
      this.friendProvider.getFriends(this.username).subscribe((data: Array<any>) => {
        this.userRating[1].count = data.length;
      });
    }
  }

/*  newMessages() {
    let conversations = this.singleton.getData();
    let news = conversations.some(e => !e.noNews);
    this.community[0].alert = news;
    for (let i=0; i < conversations.length; i++) {
      this.localNotifications.isScheduled(conversations[i].accountId).then(res => {
        if (!res && !conversations[i].noNews && !conversations[i].notified) {
          conversations[i].notified = true;
          this.localNotifications.schedule({
            id: conversations[i].accountId,
            title: 'Message',
            text: 'New Message of ' + conversations[i].accountUsername,
            data: { id: conversations[i].accountId, username: conversations[i].accountUsername, type: 'message' }
          });
        }
      });
    }
  }*/

  initializeApp() {
    this.platform.ready().then(() => {
      this.notificationSubscription = this.sessionsHandler.receiveNotificationOfClose.subscribe((response: MessageSessionHandler) => {
        let page: {component: any} = {component: HomePage};
        let toast = this.toastCtrl.create({
          message: response,
          duration: 2000,
          position: 'top'
        });
        toast.present();
        this.openPage(page);
      });
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.translate.setDefaultLang('en');
      var language = localStorage.getItem("language");
      var theme = localStorage.getItem("theme");
      this.configService.setActiveLanguage(language);
      this.configService.setActiveTheme(theme);
      if(language === 'spanish') {
        this.translate.use('es');
      } else {
        this.translate.use('en');
      }
      this.data = false;
      /*this.localNotifications.on('click').subscribe(res => {
        this.usersPrivder.getUser(res.username).subscribe((response: any) => {
          this.nav.setRoot(ChatPage, { account: response });
        });
      });*/
    });
    /*this.interval = setInterval(() => {
      this.getConversations();
    }, 5000);*/
  }



/*  public getConversations() {
    let me = parseInt(localStorage.getItem('userId'));
    if (!isNaN(me)) {
      this.messagesServ.getConversationsStatus(me).subscribe((response: Array<any>) => {
        this.singleton.setData(response);
        this.newMessages();
      }, error => {
        console.log(error);
      });
    }
    
  }*/

  openPage(page) {
    this.menuOpened();
    this.nav.setRoot(page.component);
    this.menu.close();
  }

  closePage(){
    localStorage.clear();
    this.configService.setActiveTheme('dark-theme');
    this.configService.setActiveLanguage('english');
    this.translate.use('en');
    this.data = false;
    this.userRating[0].count = 0;
    this.userRating[1].count = 0;
    this.sessionsHandler.endConnection();
    this.name = "";
    this.username = "";
    this.lastname = "";
    this.openOptions(this.visibleOption);
    //this.notificationSubscription.unsubscribe();
    this.nav.setRoot(HomePage);
    this.menu.close();
  }

  openOptions(option: string) {
    if(this.visibleOption != option) {
      this.visibleOption = option; 
    } else {
      this.visibleOption = '';
    }
  }
}

