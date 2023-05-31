import {AfterContentChecked, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../shared/services/authentication.service";
import {IOffer} from "../shared/models/IOffer";
import {OffersService} from "../shared/services/offers.service";
import {IPaymentType} from "../shared/models/IPaymentType";
import {MatSelectChange} from "@angular/material/select";
import {Subscription} from "rxjs";
import {formatDate} from "@angular/common";
import {IUserAccount} from "../shared/models/IUserAccount";
import {IPurchase} from "../shared/models/IPurchase";
import {PurchasesService} from "../shared/services/purchases.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit, AfterContentChecked, OnDestroy {

  purchaseForm: FormGroup;
  offer: IOffer | null = null;
  paymentType: string;
  isCardPayment: boolean = false;
  subs: Subscription = new Subscription();
  format: string = 'yyyy/MM/dd hh:mm:ss';
  locale: string = 'en-US';
  user: IUserAccount = null;
  public readonly paymentTypes: IPaymentType[] = [
    {
      value: 'Cash on delivery',
      content: 'cash',
    },
    {
      value: 'Credit card',
      content: 'card',
    },
  ];
  currentPaymentType: IPaymentType = this.paymentTypes[0];

  constructor(private _formBuilder: FormBuilder,
              private _ref: ChangeDetectorRef,
              private _toast: ToastrService,
              private _router: Router,
              private authenticationService: AuthenticationService,
              private offerService: OffersService,
              private purchaseService: PurchasesService) {
  }

  ngOnInit(): void {

    this.subs.add(this.offerService.offer.subscribe(res => {
        this.offer = res;
      }
    ));

    this.user = this.authenticationService.activeUser;

    this.purchaseForm = this._formBuilder.group({
      productName: new FormControl(this.offer?.product.shortName),
      productPrice: new FormControl(this.offer?.product.price + "$"),
      paymentType: new FormControl(),
      card: new FormControl('')
    });

  }

  ngAfterContentChecked() {
    this._ref.detectChanges();
  }

  public onPaymentTypeChange(event: MatSelectChange) {
    this.isCardPayment = event.value === 'card';
    this.currentPaymentType = this.paymentTypes.find(
      (paymentType: IPaymentType): boolean => paymentType.content === event.value
    );
    let paymentType = this.purchaseForm.get('paymentType').value;
    if (paymentType === 'card') {
      this.purchaseForm.get('card').setValidators(Validators.required);
    } else {
      this.purchaseForm.get('card').clearValidators();
    }
  }

  optionTrack(index: number, item: string): string {
    return item;
  }

  buyProduct() {
    let paymentType = this.purchaseForm.get('paymentType').value;
    let cardNumber: string = '';
    if (paymentType === 'card') {
      cardNumber = this.purchaseForm.get('card').value;
    }
    let dateAndTime: string = formatDate(new Date(), this.format, this.locale);
    if (paymentType && dateAndTime && this.offer && this.user) {
      let newPurchase: IPurchase = {
        id: null,
        dateAndTime: dateAndTime,
        cardNumber: cardNumber,
        offer: this.offer,
        userAccount: this.user
      };

      this.purchaseService.postPurchase(newPurchase).subscribe({
          next: (res: IPurchase): void => {

            let updatedOffer = res.offer;
            updatedOffer.isActive = false;

            this.offerService.updateOffer(updatedOffer).subscribe({
                next: () => {
                  this._toast.success("Product is purchased!");
                  this._router.navigate(['']);
                },
                error: (err) => this._toast.error("Error while purchasing product! Please try again!")
              }
            )
          },
          error: (err)  =>
            this._toast.error("Error while purchasing product! Please try again!")
        }
      )
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
