import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {AuthenticationService} from "../shared/services/authentication.service";
import {IUserAccount} from "../shared/models/IUserAccount";
import {combineLatest, combineLatestAll, forkJoin, Observable, Subscription, switchMap} from "rxjs";
import {OffersService} from "../shared/services/offers.service";
import {IOffer} from "../shared/models/IOffer";
import {ICategory} from "../shared/models/ICategory";
import {CategoriesService} from "../shared/services/categories.service";
import {IAttribute} from "../shared/models/IAttribute";
import {ImagesService} from "../shared/services/images.service";
import {ProductsService} from "../shared/services/products.service";
import {Router} from "@angular/router";
import {MatSelectChange} from "@angular/material/select";
import {IProduct} from "../shared/models/IProduct";
import {IValue} from "../shared/models/IValue";
import {formatDate} from "@angular/common";
import {IImage} from "../shared/models/IImage";
import {IImageRequest} from "../shared/models/IImageRequest";

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.component.html',
  styleUrls: ['./new-offer.component.scss']
})
export class NewOfferComponent implements OnInit, OnDestroy {

  form: FormGroup = new FormGroup({});
  attributesForm: FormGroup = new FormGroup({});
  categories: ICategory[] = [];
  subs: Subscription = new Subscription();
  offers: IOffer[];
  attributes: IAttribute[] = []
  activeUser: IUserAccount;
  currentCategoryType: ICategory = null;
  addedProduct: IProduct;
  format: string = 'yyyy/MM/dd hh:mm:ss';
  locale: string = 'en-US';

  constructor(private _formBuilder: FormBuilder,
              private _toast: ToastrService,
              private _router: Router,
              private authenticationService: AuthenticationService,
              private offersService: OffersService,
              private categoriesService: CategoriesService,
              private imagesService: ImagesService,
              private productsService: ProductsService) {

  }

  ngOnInit(): void {

    this.activeUser = this.authenticationService.activeUser;
    this.getCategories();

    this.form = this._formBuilder.group({
      category: new FormControl(null, Validators.required),
      shortName: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      isNew: new FormControl(false, Validators.required),
      image1: new FormControl(null, Validators.required),
      image2: new FormControl(null),
      image3: new FormControl(null),
      image4: new FormControl(null),
      attributes: this.attributesForm,
    });

    this.getAllOffers();
  }

  getCategories(): void {
    this.subs.add(
      this.categoriesService.getAll().subscribe(
        res => {
          this.categories = res;
        }
      )
    );
  }

  getAllOffers(): void {
    this.subs.add(
      this.offersService.getAll().subscribe(
        res => {
          this.processData(res);
        }
      ));
  }

  save() {
    let category = this.currentCategoryType;
    let shortName = this.form.value.shortName;
    let description = this.form.value.description;
    let price = this.form.value.price;
    let location = this.form.value.location;
    let isNew = this.form.value.isNew;
    let image1 = this.form.value.image1;
    let image2 = this.form.value.image2;
    let image3 = this.form.value.image3;
    let image4 = this.form.value.image4;

    if (category && this.activeUser?.id) {
      let userId = this.activeUser.id;
      let newProduct: IProduct = {
        id: null,
        shortName: shortName,
        description: description,
        price: price,
        address: location,
        isNew: isNew,
        category: category,
        contact: this.activeUser.mail,
        images: []
      };


      this.subs.add(
        this.productsService.insert(newProduct).pipe(
          switchMap(res => {
            let obs: Observable<IImage>[] = [
              this.imagesService.insert({id: null, url: image1, product: res}),
              this.imagesService.insert({id: null, url: image2, product: res}),
              this.imagesService.insert({id: null, url: image3, product: res}),
              this.imagesService.insert({id: null, url: image4, product: res})].filter(res => res !== null);
            this.addedProduct = res;
            return forkJoin([...obs]);
          })
        ).subscribe(
          res => {
            for(let attribute of this.attributes) {
              let input = this.attributesForm.get(attribute.name)?.value;
              if(input && this.addedProduct.id) {
                this.productsService.insertValue(<IValue>{idAttribute: attribute.id, idAttributeCategory: this.currentCategoryType.id, idProduct: this.addedProduct.id,  value: input }).subscribe();
              }
            };
            this.offersService.insertOffer(<IOffer>{id: null, userAccount: this.activeUser, product: this.addedProduct, isActive: true, isDeleted: false, dateAndTime: formatDate(new Date(), this.format, this.locale) })
              .subscribe({
                next: () => {
                  this._toast.success("New offer added successfully!");
                  this._router.navigate(['']);
                },
                error: () => {
                  this._toast.error("Error while adding new offer!");
                }
              });
          }
        )
      );
    }
  }

  selectCategory(value) {
    this.subs.add(
      this.offersService.getAll().subscribe(
        res => {
          this.processData(res);
        }
      ));
  }

  optionTrack(index: number, item: string): string {
    return item;
  }

  processData(res: IOffer[]): void {
    this.offers = res.filter(res => res.isActive && !res.isDeleted);
  }

  onCategoryTypeChange($event: MatSelectChange) {

    this.currentCategoryType = this.categories.find(
      (categoryType: ICategory): boolean => categoryType.id === $event.value);
    if (this.currentCategoryType) {
      this.categoriesService.getCategoryAttributes(this.currentCategoryType.id).subscribe(
        res => {
          this.attributes = res;
          this.attributesForm = new FormGroup({});
          this.attributes.forEach(attribute => this.attributesForm.addControl(attribute.name, new FormControl('', Validators.required)));
        }
      )
    }

  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
