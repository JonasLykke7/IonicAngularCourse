import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';

import { PlacesService } from '../../../../services/places/places.service';

import { Place } from '../../../../models/place.model';

import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  public place: Place;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private modalController: ModalController,
    private placesService: PlacesService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (!paramMap.has('placeID')) {
        this.navController.navigateBack('/places/tabs/discover');

        return;
      }

      this.place = this.placesService.getPlace(paramMap.get('placeID'));
    });
  }

  public onBookPlace(): void {
    this.modalController.create(
      {
        component: CreateBookingComponent,
        componentProps: { place: this.place }
      }
    )
      .then((modal) => {
        modal.present();

        return modal.onDidDismiss()
      })
      .then((result) => {
        console.log(result.data, result.role);

        if (result.role === 'confirm') {
          console.log('BOOKED!');
        }
      });
  }

}
