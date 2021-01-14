import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { Place } from '../../../models/place.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() public place: Place;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit(): void {
  }

  public onCancel(): void {
    this.modalController.dismiss(null, 'cancel');
  }

  public onBookPlace(): void {
    this.modalController.dismiss({ message: 'This is a dummy message!' }, 'confirm');
  }

}
