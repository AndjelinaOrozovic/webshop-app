import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CategoriesService} from "../shared/services/categories.service";
import {AuthenticationService} from "../shared/services/authentication.service";
import {IUserAccount} from "../shared/models/IUserAccount";
import {Subscription} from "rxjs";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {IOffer} from "../shared/models/IOffer";
import {MatTableDataSource} from "@angular/material/table";
import {OffersService} from "../shared/services/offers.service";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {IOfferCategory} from "../shared/models/IOfferCategory";

const DEFAULT_PAGE_SIZE = 4;

@Component({
  selector: 'app-my-offers',
  templateUrl: './my-offers.component.html',
  styleUrls: ['./my-offers.component.scss']
})
export class MyOffersComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  dataSource: any;
  user: IUserAccount;
  signedIn: boolean = false;
  myOffers: IOffer[] = [];
  subs: Subscription = new Subscription();
  totalItems: number;
  pageSize: number = DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  categories: IOfferCategory[] = [{id: 0, value: 'All'}, {id: 1, value: 'Active'}, {id: 2, value: 'Finished'}];
  selectedOption: IOfferCategory;
  formFilters: FormGroup;

  constructor(
    private offersService: OffersService,
    private categoriesService: CategoriesService,
    private authenticationService: AuthenticationService,
    private _toastService: ToastrService,
    private _formBuilder: FormBuilder,
  ) {
  }

  ngOnInit(): void {
    this.formFilters = this._formBuilder.group({
      selectedFilter: new FormControl(),
    });
    this.selectedOption = this.categories[0];
    this.getAllOffers();
  }

  getAllOffers(): void {

    if (this.authenticationService.activeUser?.id) {
      this.user = this.authenticationService.activeUser;
      this.signedIn = this.authenticationService.signedIn;
      this.subs.add(
        this.offersService.getOffersByUserId(this.user.id).subscribe(res => {
          this.processData(res);
          this.formFilters.get('selectedFilter').setValue(this.selectedOption.id);
        })
      );
    }

  }

  processData(res: IOffer[]): void {
    this.myOffers = res.filter(res => !res.isDeleted);
    this.dataSource = new MatTableDataSource<IOffer>(res);
    this.dataSource.paginator = this.paginator;
    this.totalItems = this.myOffers.length;
    this.getPageItems();
  }

  getPageItems(): void {
    const end: number = (this.currentPage + 1) * this.pageSize;
    const start: number = this.currentPage * this.pageSize;
    this.dataSource = this.myOffers.slice(start, end);
  }

  pageChanged(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.totalItems = event.length;
    this.getPageItems();
  }

  pageItemTrack(index: number, item: IOffer): number {
    return item.id;
  }

  optionTrack(index: number, item: string): string {
    return item;
  }

  deleteOffer(offer: any) {
    let deletedOffer = offer;
    deletedOffer.isActive = false;
    deletedOffer.isDeleted = true;
    this.subs.add(
      this.offersService.updateOffer(deletedOffer).subscribe({
        next: () => {
          this._toastService.success("Offer is deleted!");
          this.getAllOffers();
        },
        error: () => {
          this._toastService.error("Error while deleting offer! Please try again!");
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  selectCategory(value: number) {
    this.currentPage = 0;
    if (value !== 0) {
      if(value === 1) {
        this.offersService.getOffersByUserId(this.user.id).subscribe(res => {
          let activeOffers = res.filter(res => !res.isDeleted && res.isActive);
          this.processData(activeOffers);
        })
      } else if(value === 2) {
        this.offersService.getOffersByUserId(this.user.id).subscribe(res => {
          let activeOffers = res.filter(res => !res.isDeleted && !res.isActive);
          this.processData(activeOffers);
        })
      }
    }
    else {
      this.getAllOffers();
    }
  }
}
