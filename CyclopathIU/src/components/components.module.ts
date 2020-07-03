import { NgModule } from '@angular/core';
import { RentpointCardComponent } from './rentpoint-card/rentpoint-card';
import { IonicModule } from 'ionic-angular';
import { FormInputComponent } from './form-input/form-input';
import { NavbarComponent } from './navbar/navbar';
import { BykeComponent } from './byke/byke';
import { RouteCardComponent } from './route-card/route-card';
import { EventCardComponent } from './event-card/event-card';
import { TranslateModule } from '@ngx-translate/core'
import { GoogleMapsComponent } from './google-maps/google-maps';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { Geolocation } from '@ionic-native/geolocation';


@NgModule({
	declarations: [
    RentpointCardComponent,
    FormInputComponent,
    NavbarComponent,
    BykeComponent,
    RouteCardComponent,
    EventCardComponent,
    GoogleMapsComponent
  ],
  imports: [IonicModule.forRoot(RentpointCardComponent), IonicModule.forRoot(BykeComponent), TranslateModule.forChild()],
	exports: [
    RentpointCardComponent,
    FormInputComponent,
    NavbarComponent,
    BykeComponent,
    RouteCardComponent,
    EventCardComponent,
    GoogleMapsComponent
  ],
  entryComponents: [
    RouteCardComponent
  ],
	providers: [
    NativeGeocoder,
    Geolocation,
  ]
})
export class ComponentsModule {
  constructor(public translatemodule: TranslateModule) {
  }
}
