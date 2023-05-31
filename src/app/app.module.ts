import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import {MainPageModule} from "./main-page/main-page.module";
import {FlexLayoutModule} from "@angular/flex-layout";
import {CommonModule} from "@angular/common";
import {AngularMaterialModule} from "./shared/angular-material/angular-material.module";
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {HeaderComponent} from "./header/header.component";
import { OfferDetailsComponent } from './offer-details/offer-details.component';
import {ToastrModule} from "ngx-toastr";
import { ActivationComponent } from './activation/activation.component';
import { ProfileComponent } from './profile/profile.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { NewOfferComponent } from './new-offer/new-offer.component';
import { MyPurchasesComponent } from './my-purchases/my-purchases.component';
import { MyOffersComponent } from './my-offers/my-offers.component';
import { SendMessageComponent } from './send-message/send-message.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    OfferDetailsComponent,
    ActivationComponent,
    ProfileComponent,
    PurchaseComponent,
    NewOfferComponent,
    MyPurchasesComponent,
    MyOffersComponent,
    SendMessageComponent
  ],
    imports: [
        BrowserModule,
        CommonModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        FlexLayoutModule,
        AngularMaterialModule,
        MainPageModule,
        ToastrModule.forRoot({
            timeOut: 3000,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
        }),
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
