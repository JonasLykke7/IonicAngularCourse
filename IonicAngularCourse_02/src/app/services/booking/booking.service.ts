import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay, take, tap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';

import { Booking } from '../../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private _bookings: BehaviorSubject<Booking[]> = new BehaviorSubject<Booking[]>([]);

  public get bookings(): Observable<Booking[]> {
    return this._bookings.asObservable();
  }

  constructor(
    private authService: AuthService
  ) { }

  public addBooking(placeID: string, placeIitle: string, placeImage: string, firstName: string, lastName: string, guestNumber: number, dateFrom: Date, dateTo: Date): Observable<Booking[]> {
    const booking = new Booking(Math.random().toString(), placeID, this.authService.userID, placeIitle, placeImage, firstName, lastName, guestNumber, dateFrom, dateTo);

    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap((bookings: Booking[]) => {
        this._bookings.next(bookings.concat(booking));
      }));
  }

  public cancelBooking(id: string): Observable<Booking[]> {
    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap((bookings: Booking[]) => {
        this._bookings.next(bookings.filter(b => b.id !== id));
      }));
  }
}
