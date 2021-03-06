import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { PlacesService } from '../../../../services/places/places.service';

import { Place } from '../../../../models/place.model';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  public placeID: string;
  private _placeSubscription: Subscription;
  public place: Place;
  public isLoading: boolean = false;
  public form: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private navController: NavController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private placesService: PlacesService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if (!paramMap.has('placeID')) {
        this.navController.navigateBack('/places/tabs/offers');

        return;
      }

      this.placeID = paramMap.get('placeID');
      this.isLoading = true;

      this._placeSubscription = this.placesService.getPlace(paramMap.get('placeID')).subscribe((place: Place) => {
        this.place = place;

        this.form = new FormGroup({
          title: new FormControl(this.place.title, { updateOn: 'blur', validators: [Validators.required] }),
          description: new FormControl(this.place.description, { updateOn: 'blur', validators: [Validators.required, Validators.maxLength(180)] })
        });

        this.isLoading = false;
      }, (error) => {
        this.alertController.create({
          header: 'An error occurred.',
          message: 'Place could not be fetched. Pleace try again later.',
          buttons: [
            {
              text: 'Okay',
              handler: () => {
                this.router.navigate(['/places/tabs/offers']);
              }
            }
          ]
        })
          .then((alert) => {
            alert.present();
          });
      });
    });
  }

  ngOnDestroy(): void {
    if (this._placeSubscription) {
      this._placeSubscription.unsubscribe();
    }
  }

  public onUpdateOffer(): void {
    if (!this.form.valid) {
      return;
    }

    this.loadingController.create({
      message: 'Updating place...'
    }).then((loading) => {
      loading.present();

      this.placesService.updatePlace(this.place.id, this.form.value.title, this.form.value.description).subscribe(() => {
        this.form.reset();
        loading.dismiss();
        this.router.navigate(['/places/tabs/offers']);
      });
    });
  }

}
