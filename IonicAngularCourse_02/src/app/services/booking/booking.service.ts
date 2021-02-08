import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { delay, map, switchMap, take, tap } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';

import { Booking } from '../../models/booking.model';

interface IBookingData {
  bookedFrom: Date;
  bookedTo: Date;
  firstName: string;
  guestNumber: number;
  lastName: string;
  placeID: string;
  placeImage: string;
  placeTitle: string;
  userID: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private _firebaseDatabaseURL: string = 'https://ionic-angular-course-a67b4-default-rtdb.europe-west1.firebasedatabase.app';
  private _offeredPlacesURL: string = '/bookings';

  private _bookings: BehaviorSubject<Booking[]> = new BehaviorSubject<Booking[]>([]);

  public get bookings(): Observable<Booking[]> {
    return this._bookings.asObservable();
  }

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) { }

  public fetchBookings(): Observable<any[]> {
    return this.httpClient.get<{ [key: string]: IBookingData }>(`${this._firebaseDatabaseURL}${this._offeredPlacesURL}.json?orderBy="userID"&equalTo="${this.authService.userID}"`)
      .pipe(
        map((bookingData) => {
          const bookings = [];

          for (const key in bookingData) {
            if (Object.prototype.hasOwnProperty.call(bookingData, key)) {
              bookings.push(new Booking(key, bookingData[key].placeID, bookingData[key].userID, bookingData[key].placeTitle, bookingData[key].placeImage, bookingData[key].firstName, bookingData[key].lastName, bookingData[key].guestNumber, new Date(bookingData[key].bookedFrom), new Date(bookingData[key].bookedTo)));
            }
          }

          return bookings;
        }), tap((bookings) => {
          this._bookings.next(bookings);
        })
      );
  }

  public addBooking(placeID: string, placeIitle: string, placeImage: string, firstName: string, lastName: string, guestNumber: number, dateFrom: Date, dateTo: Date): Observable<Booking[]> {
    let generatedID: string;

    const booking = new Booking(Math.random().toString(), placeID, this.authService.userID, placeIitle, placeImage, firstName, lastName, guestNumber, dateFrom, dateTo);

    return this.httpClient.post<{ name: string }>(`${this._firebaseDatabaseURL}${this._offeredPlacesURL}.json`, { ...booking, id: null })
      .pipe(
        switchMap((response) => {
          generatedID = response.name;

          return this.bookings;
        }),
        take(1),
        tap((bookings: Booking[]) => {
          booking.id = generatedID;

          this._bookings.next(bookings.concat(booking));
        })
      );
  }

  public cancelBooking(id: string) {
    return this.httpClient.delete(`${this._firebaseDatabaseURL}${this._offeredPlacesURL}/${id}.json`)
      .pipe(
        switchMap(() => {
          return this.bookings;
        }),
        take(1),
        tap((bookings) => {
          this._bookings.next(bookings.filter(b => b.id !== id));
        })
      );
  }
}
