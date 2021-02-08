import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

import { PlacesService } from '../../../../services/places/places.service';

import { PlaceLocation } from '../../../../models/location.model';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  public form: FormGroup;

  constructor(
    private router: Router,
    private loadingController: LoadingController,
    private placesService: PlacesService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, { updateOn: 'blur', validators: [Validators.required] }),
      description: new FormControl(null, { updateOn: 'blur', validators: [Validators.required, Validators.maxLength(180)] }),
      price: new FormControl(null, { updateOn: 'blur', validators: [Validators.required, Validators.min(1)] }),
      dateFrom: new FormControl(null, { updateOn: 'blur', validators: [Validators.required] }),
      dateTo: new FormControl(null, { updateOn: 'blur', validators: [Validators.required] }),
      location: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null)
    });
  }

  public onLocationPicked(location: PlaceLocation): void {
    this.form.patchValue({ location: location });
  }

  public onImagePicked(image: string): void {
    this.form.patchValue({ image: image });
  }

  public onCreateOffer(): void {
    if (!this.form.valid || !this.form.get('image').value) {
      return;
    }

    this.loadingController.create({
      message: 'Creating place...'
    }).then((loading) => {
      loading.present();

      this.placesService.addPlace(this.form.value.title, this.form.value.description, +this.form.value.price, new Date(this.form.value.dateFrom), new Date(this.form.value.dateTo), this.form.value.location).subscribe(() => {
        this.form.reset();

        loading.dismiss();

        this.router.navigate(['/places/tabs/offers']);
      });
    });
  }

}
