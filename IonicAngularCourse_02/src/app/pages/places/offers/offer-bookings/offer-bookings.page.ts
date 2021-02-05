import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { PlacesService } from '../../../../services/places/places.service';

import { Place } from '../../../../models/place.model';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit, OnDestroy {
  private _placeSubscription: Subscription;
  public place: Place;

  constructor(
    private activatedRoute: ActivatedRoute,
    private navController: NavController,
    private placesService: PlacesService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (!paramMap.has('placeID')) {
        this.navController.navigateBack('/places/tabs/offers');

        return;
      }

      this._placeSubscription = this.placesService.getPlace(paramMap.get('placeID')).subscribe((place: Place) => {
        this.place = place;
      });
    });
  }

  ngOnDestroy(): void {
    if (this._placeSubscription) {
      this._placeSubscription.unsubscribe();
    }
  }

}
