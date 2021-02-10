import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

import { AuthService } from '../../../../services/auth/auth.service';
import { PlacesService } from '../../../../services/places/places.service';
import { BookingService } from '../../../../services/booking/booking.service';

import { Place } from '../../../../models/place.model';

import { MapModalComponent } from '../../../../shared/map-modal/map-modal.component';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  private _placeSubscription: Subscription;
  public isLoading: boolean = false;
  public place: Place;
  public isBookable: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private navController: NavController,
    private alertController: AlertController,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
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

      this.isLoading = true;

      let fetchedUserID: string;

      this._placeSubscription = this.authService.userID.pipe(take(1), switchMap(userID => {
        if (!userID) {
          throw new Error('Found no user!');
        }

        fetchedUserID = userID;

        return this.placesService.getPlace(paramMap.get('placeID'));
      })).subscribe((place: Place) => {
        this.place = place;

        this.isBookable = this.place.userID !== fetchedUserID;

        this.isLoading = false;
      }, (error) => {
        this.alertController.create({
          header: 'An error occurred!',
          message: 'Could not load place.',
          buttons: [
            {
              text: 'Okay',
              handler: () => {
                this.router.navigate(['/places/tabs/discover']);
              }
            }
          ]
        }).then((alert) => {
          alert.present();
        });
      });
    });
  }

  ngOnDestroy(): void {
    if (this._placeSubscription) {
      this._placeSubscription.unsubscribe();
    }
  }

  public onShowFullMap(): void {
    this.modalController
      .create({
        component: MapModalComponent,
        componentProps: {
          center: {
            lat: this.place.location.lat,
            lng: this.place.location.long
          },

          selectable: false,
          closeButtonText: 'Close',
          title: this.place.location.address
        }
      })
      .then((modal) => {
        modal.present();
      });
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
