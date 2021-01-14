import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OffersPage } from './offers.page';

const routes: Routes = [
  {
    path: '',
    component: OffersPage
  },
  {
    path: 'new',
    loadChildren: () => import('../../Places/Offers/new-offer/new-offer.module').then(m => m.NewOfferPageModule)
  },
  {
    path: 'edit/:placeID',
    loadChildren: () => import('../../Places/Offers/edit-offer/edit-offer.module').then(m => m.EditOfferPageModule)
  },
  {
    path: ':placeID',
    loadChildren: () => import('../../Places/Offers/offer-bookings/offer-bookings.module').then(m => m.OfferBookingsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OffersPageRoutingModule { }
