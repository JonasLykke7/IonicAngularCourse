import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';

import { PlacesService } from '../../../services/places/places.service';
import { AuthService } from '../../../services/auth/auth.service';

import { Place } from '../../../models/place.model';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  private _placesSubscription: Subscription;
  public places: Place[];
  public listedPlaces: Place[];
  public relevantPlaces: Place[];

  constructor(
    private menuController: MenuController,
    private placesService: PlacesService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this._placesSubscription = this.placesService.places.subscribe((places: Place[]) => {
      this.places = places;

      this.relevantPlaces = this.places;
      this.listedPlaces = this.relevantPlaces.slice(1);
    });
  }

  ngOnDestroy(): void {
    if (this._placesSubscription) {
      this._placesSubscription.unsubscribe();
    }
  }

  public onMenu(): void {
    this.menuController.toggle();
  }

  public onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>): void {
    if (event.detail.value === 'all') {
      this.relevantPlaces = this.places;
      this.listedPlaces = this.relevantPlaces.slice(1);
    } else {
      this.relevantPlaces = this.places.filter(place => place.userID !== this.authService.userID);
      this.listedPlaces = this.relevantPlaces.slice(1);
    }
  }

}
