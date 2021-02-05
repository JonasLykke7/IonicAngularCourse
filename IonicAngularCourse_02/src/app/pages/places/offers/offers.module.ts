import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { OffersPageRoutingModule } from './offers-routing.module';

import { OffersPage } from './offers.page';
import { OfferItemComponent } from './offer-item/offer-item.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    OffersPageRoutingModule
  ],
  declarations: [
    OffersPage,
    OfferItemComponent
  ]
})
export class OffersPageModule {}
