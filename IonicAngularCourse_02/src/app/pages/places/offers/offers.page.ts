import { Component, OnInit } from '@angular/core';

import { PlacesService } from '../../../services/places/places.service';

import { Place } from '../../../models/place.model';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  public offers: Place[];

  constructor(
    private placesService: PlacesService
  ) { }

  ngOnInit(): void {
    this.offers = this.placesService.places;
  }

}
