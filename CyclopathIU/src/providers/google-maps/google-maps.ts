import { HttpClient } from '@angular/common/http';
import { Injectable, ElementRef } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { IRentPoint } from '../../models/rent-point';
import { ILocality, IShowRentPoint } from '../../models/google-maps';

/*
  Generated class for the GoogleMapsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GoogleMapsProvider {

  private mapSubject: Subject<google.maps.Map> = new Subject<google.maps.Map>();
  public mapSubject$: Observable<google.maps.Map> = this.mapSubject.asObservable();
  public mapRef: ElementRef;
  public currentPosition: google.maps.LatLng;
  private directionsService: google.maps.DirectionsService;
  private directionsDisplay: google.maps.DirectionsRenderer;
  private geocoder: google.maps.Geocoder;
  private showRentPointSubject: Subject<IShowRentPoint> = new Subject<IShowRentPoint>();
  public showRentPointSubject$: Observable<IShowRentPoint> = this.showRentPointSubject.asObservable();
  private mapClick: Subject<any> = new Subject<any>();
  public mapClick$: Observable<any> = this.mapClick.asObservable();

  constructor() {
    this.directionsService = new google.maps.DirectionsService();
    this.directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
    this.geocoder = new google.maps.Geocoder();
  }

  set Map(map: google.maps.Map) {
    this.mapSubject.next(map);
  }

  addEventListenerToMap(map: google.maps.Map): google.maps.MapsEventListener {
    return google.maps.event.addListener(map, 'click', (event) => {
      this.mapClick.next(event);
    });
  }

  removeEventListenerOfMap(mapEventListener: google.maps.MapsEventListener): void {
    google.maps.event.removeListener(mapEventListener);
  }

  getInformationOfCoordinates(location: google.maps.LatLng): Promise<ILocality | string> {
    return new Promise((resolve, reject) => {
      let geocoderRequest: google.maps.GeocoderRequest = {
        location: location,
      }
      this.geocoder.geocode(
        geocoderRequest,
        (results: Array<google.maps.GeocoderResult>, status: google.maps.GeocoderStatus) => {
          if (status === google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                let street = '';
                let city = '';
                let state = '';
                let country = '';
                let zipcode = '';
                for (let i = 0; i < results.length; i++) {
                    if (results[i].types[0] === 'locality') {
                        city = results[i].address_components[0].long_name;
                        state = results[i].address_components[2].long_name;
                    }
                    if (results[i].types[0] === 'postal_code' && zipcode == '') {
                        zipcode = results[i].address_components[0].long_name;
                    }
                    if (results[i].types[0] === 'country') {
                        country = results[i].address_components[0].long_name;
                    }
                    if (results[i].types[0] === 'route' && street == '') {
                        for (let j = 0; j < 4; j++) {
                            if (j == 0) {
                                street = results[i].address_components[j].long_name;
                            } else {
                                street += ', ' + results[i].address_components[j].long_name;
                            }
                        }
                    }
                    if (results[i].types[0] === 'street_address') {
                        for (let j = 0; j < 4; j++) {
                            if (j == 0) {
                                street = results[i].address_components[j].long_name;
                            } else {
                                street += ', ' + results[i].address_components[j].long_name;
                            }
                        }
                    }
                }
                if (zipcode == '') {
                    if (typeof results[0].address_components[8] !== 'undefined') {
                        zipcode = results[0].address_components[8].long_name;
                    }
                }
                if (country == '') {
                    if (typeof results[0].address_components[7] !== 'undefined') {
                        country = results[0].address_components[7].long_name;
                    }
                }
                if (state == '') {
                    if (typeof results[0].address_components[6] !== 'undefined') {
                        state = results[0].address_components[6].long_name;
                    }
                }
                if (city == '') {
                    if (typeof results[0].address_components[5] !== 'undefined') {
                        city = results[0].address_components[5].long_name;
                    }
                }
                let locality: ILocality = {
                    street: street,
                    city: city,
                    state: state,
                    country: country,
                    zipcode: zipcode,
                };
                return resolve(locality);
            } else {
              return reject('No results found');
            }
          } else {
            return reject('Geocoder failed due to: ' + status);
          }
        }
      );
    });
  }

  addMarker(map: google.maps.Map, position:google.maps.LatLng, title:string, icon?: string): google.maps.Marker {
    let marker: google.maps.Marker = new google.maps.Marker({
      position: position,
      map: map,
      title: title,
      icon: icon
    });
    return marker;
  }

  removeMarker(marker: google.maps.Marker): void {
    marker.setMap(null);
  }

  drawRoute(map: google.maps.Map, start: google.maps.LatLng, end: google.maps.LatLng, waypoints: Array<google.maps.DirectionsWaypoint>): void {
    this.directionsDisplay.setMap(map);
    let request: google.maps.DirectionsRequest = {
      origin: start,
      destination: end,
      waypoints: waypoints,
      travelMode: google.maps.TravelMode.WALKING
    };
    this.directionsService.route(request, (response: google.maps.DirectionsResult, status: google.maps.DirectionsStatus) => {
      if (status == google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(response);
      }
    });
  }

  addEventListenerToMarker(marker: google.maps.Marker, rentPoint: IRentPoint, editable: boolean = false): void {
    marker.addListener('click', (event) => {
      this.showRentPointSubject.next({rentPoint: rentPoint, editable: editable});
      this.mapRef.nativeElement.style.height = '65vh';
    });
  }
}