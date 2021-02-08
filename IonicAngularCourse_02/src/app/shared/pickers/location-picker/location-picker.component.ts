import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Capacitor, Plugins } from '@capacitor/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { MapModalComponent } from '../../map-modal/map-modal.component';
import { environment } from '../../../../environments/environment';

import { Coordinates, PlaceLocation } from '../../../models/location.model';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss']
})
export class LocationPickerComponent implements OnInit {
  @Input() public showPreview: boolean = false;
  @Output() private locationPick = new EventEmitter<PlaceLocation>();

  public selectedLocationImage: string;
  public isLoading: boolean = false;

  constructor(
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private modalController: ModalController,
    private httpClient: HttpClient
  ) { }

  ngOnInit(): void { }

  public onPickLocation(): void {
    this.actionSheetController.create({
      header: 'Pleace Choose',
      buttons: [
        {
          text: 'Auto-Locate',
          handler: () => {
            this.locateUser();
          }
        },
        {
          text: 'Pick on Map',
          handler: () => {
            this.openMap();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    })
      .then((actionSheet) => {
        actionSheet.present();

      });
  }

  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();

      return;
    }

    this.isLoading = true;

    Plugins.Geolocation.getCurrentPosition()
      .then((geolocationPosition) => {
        const coordinates: Coordinates = {
          lat: geolocationPosition.coords.latitude,
          long: geolocationPosition.coords.longitude
        };

        this.createPlace(coordinates.lat, coordinates.long);
        this.isLoading = false;
      }).catch((error) => {
        this.isLoading = false;
        this.showErrorAlert();
      });
  }

  private showErrorAlert() {
    this.alertController.create({
      header: 'Could not fetch location',
      message: 'Pleace use the map to pick a location!',
      buttons: ['OK']
    })
      .then((alert) => {
        alert.present();
      });
  }

  private openMap() {
    this.modalController.create({ component: MapModalComponent }).then((modal) => {
      modal.onDidDismiss().then((modalData) => {
        if (!modalData.data) {
          return;
        }

        const coordinates: Coordinates = {
          lat: modalData.data.lat,
          long: modalData.data.long
        };

        this.createPlace(coordinates.lat, coordinates.long);
      });

      modal.present();
    });
  }

  private createPlace(lat: number, long: number) {
    const pickedLocation: PlaceLocation = {
      lat: lat,
      long: long,
      address: null,
      staticMapImageURL: null
    };

    this.isLoading = true;

    this.getAddress(lat, long)
      .pipe(
        switchMap((address) => {
          pickedLocation.address = address;

          return of(
            this.getMapImage(pickedLocation.lat, pickedLocation.long, 14)
          );
        })
      )
      .subscribe((staticMapImageURL) => {
        pickedLocation.staticMapImageURL = staticMapImageURL;
        this.selectedLocationImage = staticMapImageURL;

        this.isLoading = false;
        this.locationPick.emit(pickedLocation);
      });
  }

  private getAddress(lat: number, long: number): Observable<any> {
    return this.httpClient
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${environment.googleMapsAPIKey
        }`
      )
      .pipe(
        map((geoData) => {
          if (!geoData || !geoData.results || geoData.results.length === 0) {
            return null;
          }

          return geoData.results[0].formatted_address;
        })
      );
  }

  private getMapImage(lat: number, long: number, zoom: number): string {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${long}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${long}
    &key=${environment.googleMapsAPIKey}`;
  }
}
