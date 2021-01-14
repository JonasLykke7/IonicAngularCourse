import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { PlaceDetailPageRoutingModule } from './place-detail-routing.module';

import { PlaceDetailPage } from './place-detail.page';
import { CreateBookingComponent } from '../../../bookings/create-booking/create-booking.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    PlaceDetailPageRoutingModule
  ],
  declarations: [
    PlaceDetailPage,
    CreateBookingComponent
  ]
})
export class PlaceDetailPageModule { }
