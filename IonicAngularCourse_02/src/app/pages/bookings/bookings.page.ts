import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { BookingService } from 'src/app/services/booking/booking.service';

import { Booking } from '../../models/booking.model';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  private _bookingSubscription: Subscription;
  public bookings: Booking[];

  constructor(
    private loadingController: LoadingController,
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
    this._bookingSubscription = this.bookingService.bookings.subscribe((bookings: Booking[]) => {
      this.bookings = bookings;
    });
  }

  ngOnDestroy(): void {
    if (this._bookingSubscription) {
      this._bookingSubscription.unsubscribe();
    }
  }

  public onCancelBookings(id: string, slidingItem: IonItemSliding): void {
    slidingItem.close();

    this.loadingController.create({ message: 'Cancelling...' })
      .then((loading) => {
        loading.present();

        this.bookingService.cancelBooking(id).subscribe(() => {
          loading.dismiss();
        });
      });
  }

}
