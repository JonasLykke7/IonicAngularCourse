import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { Place } from '../../../models/place.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() public place: Place;
  @Input() public selectedMode: 'select' | 'random';
  @ViewChild('form', { static: true }) public form: NgForm;

  public startDate: string;
  public endDate: string;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit(): void {
    const availableFrom: Date = new Date(this.place.availableFrom);
    const availableTo: Date = new Date(this.place.availableTo);

    if (this.selectedMode === 'random') {
      this.startDate = new Date(availableFrom.getTime() + Math.random() * (availableTo.getTime() - 7 * 24 * 60 * 60 * 1000 - availableFrom.getTime())).toISOString();

      this.endDate = new Date(new Date(this.startDate).getTime() + Math.random() * (new Date(this.startDate).getTime() + 6 * 24 * 60 * 60 * 1000 - new Date(this.startDate).getTime())).toISOString();
    }
  }

  public onCancel(): void {
    this.modalController.dismiss(null, 'cancel');
  }

  public datesValid(): boolean {
    const startDate: Date = new Date(this.form.value['dateFrom']);
    const endDate: Date = new Date(this.form.value['dateTo']);

    return endDate > startDate;
  }

  public onBookPlace(): void {
    if (!this.form.valid || !this.datesValid()) {
      return;
    }

    this.modalController.dismiss({
      bookingData: {
        firstName: this.form.value['firstName'],
        lastName: this.form.value['lastName'],
        guestNumber: +this.form.value['guestNumber'],
        startDate: new Date(this.form.value['dateFrom']),
        endDate: new Date(this.form.value['dateTo'])
      }
    }, 'confirm');
  }

}
