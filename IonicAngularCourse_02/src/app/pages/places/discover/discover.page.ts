import { Component, OnInit } from '@angular/core';

import { PlacesService } from '../../../services/Places/places.service';

import { Place } from '../../../models/place.model';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  public loadedPlaces: Place[];

  constructor(
    private placesService: PlacesService
  ) { }

  ngOnInit() {
    this.loadedPlaces = this.placesService.places;
  }

}