import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from "./main-page/main-page.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {OfferDetailsComponent} from "./offer-details/offer-details.component";
import {ActivationComponent} from "./activation/activation.component";
import {ProfileComponent} from "./profile/profile.component";
import {PurchaseComponent} from "./purchase/purchase.component";

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
    component: ProfileComponent
  },
  {
    path: 'purchase',
    component: PurchaseComponent
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
