import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { switchMap } from 'rxjs/operators';

import { PlacesService } from '../../../../services/places/places.service';

import { PlaceLocation } from '../../../../models/location.model';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

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
    let imageFile: any;

    try {
      imageFile = base64toBlob(
        image.replace('data:image/png;base64,', ''),
        'image/png'
      );
    } catch (error) {
      console.log(error);

      return;
    }

    this.form.patchValue({ image: imageFile });
  }

  public onCreateOffer(): void {
    if (!this.form.valid || !this.form.get('image').value) {
      return;
    }

    this.loadingController.create({
      message: 'Creating place...'
    }).then((loading) => {
      loading.present();
      this.placesService.uploadImage(this.form.get('image').value)
        .pipe(
          switchMap((uploadRes) => {
            return this.placesService.addPlace(this.form.value.title, this.form.value.description, +this.form.value.price, new Date(this.form.value.dateFrom), new Date(this.form.value.dateTo), this.form.value.location, uploadRes.imageUrl)
          })
        ).subscribe(() => {
          this.form.reset();

          loading.dismiss();

          this.router.navigate(['/places/tabs/offers']);
        });
    });
  }

}
