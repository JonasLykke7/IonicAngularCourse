import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { PlacesService } from '../../../services/places/places.service';
import { AuthService } from '../../../services/auth/auth.service';

import { Place } from '../../../models/place.model';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  private _fetchPlacesSubscription: Subscription;
  private _placesSubscription: Subscription;
  public places: Place[];
  public listedPlaces: Place[];
  public relevantPlaces: Place[];
  public isLoading: boolean = false;

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

  ionViewWillEnter(): void {
    this.isLoading = true;

    this._fetchPlacesSubscription = this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    if (this._fetchPlacesSubscription) {
      this._fetchPlacesSubscription.unsubscribe();
    }

    if (this._placesSubscription) {
      this._placesSubscription.unsubscribe();
    }
  }

  public onMenu(): void {
    this.menuController.toggle();
  }

  public onFilterUpdate(event): void {
    this.authService.userID.pipe(take(1)).subscribe((userID) => {
      if (event.detail.value === 'all') {
        this.relevantPlaces = this.places;
        this.listedPlaces = this.relevantPlaces.slice(1);
      } else {
        this.relevantPlaces = this.places.filter(place => place.userID !== userID);
        this.listedPlaces = this.relevantPlaces.slice(1);
      }
    });
  }

}
