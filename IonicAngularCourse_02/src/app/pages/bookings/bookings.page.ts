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
  private _fetchBookingsSubscription: Subscription;
  private _bookingsSubscription: Subscription;
  public isLoading: boolean = false;
  public bookings: Booking[];

  constructor(
    private loadingController: LoadingController,
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
    this._bookingsSubscription = this.bookingService.bookings.subscribe((bookings: Booking[]) => {
      this.bookings = bookings;
    });
  }

  ionViewWillEnter(): void {
    this.isLoading = true;

    this._fetchBookingsSubscription = this.bookingService.fetchBookings().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    if (this._fetchBookingsSubscription) {
      this._fetchBookingsSubscription.unsubscribe();
    }

    if (this._bookingsSubscription) {
      this._bookingsSubscription.unsubscribe();
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
