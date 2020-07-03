import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { LatLng, GoogleMapOptions, GoogleMap } from '@ionic-native/google-maps';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { IRentPoint } from '../../models/rent-point';
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { Subscription } from 'rxjs';
import { IShowRentPoint } from '../../models/google-maps';

@Component({
  selector: 'google-maps',
  templateUrl: 'google-maps.html'
})
export class GoogleMapsComponent implements OnInit, OnDestroy {

  @ViewChild('map') mapRef: ElementRef;
  private map: google.maps.Map;
  private rentPointToShow: IRentPoint;
  private rentPointRef: Subscription = null;
  private editable: boolean;

  constructor(
    private geolocation: Geolocation,
    private googleMapsProvider: GoogleMapsProvider
    //private locationAccuracy: LocationAccuracy,
  ) {

  }

  ngOnInit(): void {
    this.geolocation.getCurrentPosition().then((resp: Geoposition) => {
      this.googleMapsProvider.currentPosition = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      this.map = this.initMap(this.googleMapsProvider.currentPosition);
      this.googleMapsProvider.Map = this.map;
     }).catch((error) => {
       console.log('Error getting location', error);
     });
    this.rentPointRef = this.googleMapsProvider.showRentPointSubject$.subscribe((response: IShowRentPoint) => {
      this.rentPointToShow = response.rentPoint;
      this.editable = response.editable;
    });
     this.googleMapsProvider.mapRef = this.mapRef;
  }

  ngOnDestroy(): void {
    this.rentPointRef.unsubscribe();
    this.rentPointToShow = null;
  }

  initMap(location: google.maps.LatLng): google.maps.Map {
    let mapOptions: GoogleMapOptions = {
      center: location,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    let map = new google.maps.Map(this.mapRef.nativeElement, mapOptions);
    return map;
  }
}

