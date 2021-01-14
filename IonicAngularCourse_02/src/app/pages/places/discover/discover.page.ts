import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

import { PlacesService } from '../../../services/places/places.service';

import { Place } from '../../../models/place.model';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  public places: Place[];

  constructor(
    private menuController: MenuController,
    private placesService: PlacesService
  ) { }

  ngOnInit(): void {
    this.places = this.placesService.places;
  }

  public onMenu(): void {
    this.menuController.toggle();
  }

}
