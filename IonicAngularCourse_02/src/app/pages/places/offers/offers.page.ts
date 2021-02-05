import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { PlacesService } from '../../../services/places/places.service';

import { Place } from '../../../models/place.model';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  private _fetchPlacesSubscription: Subscription;
  private _placesSubscription: Subscription;
  public offers: Place[];
  public isLoading: boolean = false;

  constructor(
    private router: Router,
    private placesService: PlacesService
  ) { }

  ngOnInit(): void {
    this._placesSubscription = this.placesService.places.subscribe((places: Place[]) => {
      this.offers = places;
    });
  }

  ionViewWillEnter(): void {
    this.isLoading = true;
    this._fetchPlacesSubscription = this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    if (this._placesSubscription) {
      this._fetchPlacesSubscription.unsubscribe();
      this._placesSubscription.unsubscribe();
    }
  }

  public onEdit(id: string, slidingItem: IonItemSliding): void {
    slidingItem.close();

    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', id]);
  }

}
