import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from "./main-page/main-page.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {OfferDetailsComponent} from "./offer-details/offer-details.component";
import {ActivationComponent} from "./activation/activation.component";
import {ProfileComponent} from "./profile/profile.component";
import {PurchaseComponent} from "./purchase/purchase.component";
import {NewOfferComponent} from "./new-offer/new-offer.component";
import {MyOffersComponent} from "./my-offers/my-offers.component";
import {MyPurchasesComponent} from "./my-purchases/my-purchases.component";
import {SendMessageComponent} from "./send-message/send-message.component";
import {GuardService} from "./shared/services/guard.service";

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'offer-details/:id',
    component: OfferDetailsComponent
  },
  {
    path: 'activation',
    component: ActivationComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [GuardService]
  },
  {
    path: 'purchase',
    component: PurchaseComponent,
    canActivate: [GuardService]
  },
  {
    path: 'new-offer',
    component: NewOfferComponent,
    canActivate: [GuardService]
  },
  {
    path: 'my-offers',
    component: MyOffersComponent,
    canActivate: [GuardService]
  },
  {
    path: 'my-purchases',
    component: MyPurchasesComponent,
    canActivate: [GuardService]
  },
  {
    path: 'send-message',
    component: SendMessageComponent,
    canActivate: [GuardService]
  },
  {
    path: '**',
    component: MainPageComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
