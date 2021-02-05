import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ActionSheetController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { AuthService } from '../../../../services/auth/auth.service';
import { PlacesService } from '../../../../services/places/places.service';
import { BookingService } from '../../../../services/booking/booking.service';

import { Place } from '../../../../models/place.model';

import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  private _placeSubscription: Subscription;
  public place: Place;
  public isBookable: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private authService: AuthService,
    private placesService: PlacesService,
    private bookingService: BookingService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (!paramMap.has('placeID')) {
        this.navController.navigateBack('/places/tabs/discover');

        return;
      }

      this._placeSubscription = this.placesService.getPlace(paramMap.get('placeID')).subscribe((place: Place) => {
        this.place = place;
        
        this.isBookable = this.place.userID !== this.authService.userID;
      });
    });
  }

  ngOnDestroy(): void {
    if (this._placeSubscription) {
      this._placeSubscription.unsubscribe();
    }
  }

  public onBookPlace(): void {
    this.actionSheetController.create({
      header: 'Choose an Action',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.openBookingModal('select');
          }
        },
        {
          text: 'Random Date',
          handler: () => {
            this.openBookingModal('random');
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

  private openBookingModal(mode: 'select' | 'random'): void {
    this.modalController.create(
      {
        component: CreateBookingComponent,
        componentProps: { place: this.place, selectedMode: mode }
      }
    )
      .then((modal) => {
        modal.present();

        return modal.onDidDismiss()
      })
      .then((result) => {
        if (result.role === 'confirm') {
          this.loadingController.create({
            message: 'Booking place...'
          }).then((loading) => {
            loading.present();

            const data: any = result.data.bookingData;

            this.bookingService.addBooking(this.place.id, this.place.title, this.place.imageURL, data.firstName, data.lastName, data.guestNumber, data.startDate, data.endDate).subscribe(() => {
              loading.dismiss();
            });
          });
        }
      });
  }

}
