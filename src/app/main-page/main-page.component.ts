import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CategoriesService} from "../shared/services/categories.service";
import {ICategory} from "../shared/models/ICategory";
import {IOffer} from "../shared/models/IOffer";
import {OffersService} from "../shared/services/offers.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {Router} from "@angular/router";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {debounceTime, distinctUntilChanged, Subscription} from "rxjs";

const DEFAULT_PAGE_SIZE = 4;

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  dataSource: any;
  subs = new Subscription();
  searchTerm: string = "";
  categories: ICategory[] = [];
  offers: IOffer[] = [];
  totalItems: number;
  pageSize: number = DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  selectedValue: number = 0;
  formFilters: FormGroup;
  selectedOption: ICategory;

  constructor(private categoriesService: CategoriesService,
              private offersService: OffersService,
              private _router: Router,
              private _formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.formFilters = this._formBuilder.group({
      selectedFilter: new FormControl(),
      searchedFilter: new FormControl(''),
    });
    this.selectedOption = {id: 0, name: 'All', parentCategory: null, isDeleted: false};
    this.getCategories();
    this.getAllOffers();
    this.subs.add(this.formFilters.get('searchedFilter').valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe(res => {
      this.filterOffers(res);
    }));
  }

  getCategories(): void {
    this.subs.add(
      this.categoriesService.getAll().subscribe(
        res => {
          this.categories = res;
          this.categories.forEach(el => el.name = this.setName(el));
          this.categories.unshift({id: 0, name: 'All', parentCategory: null, isDeleted: false});
          this.categories.sort((a, b) => a.name.localeCompare(b.name));
          this.formFilters.get('selectedFilter').setValue(this.selectedOption.id);
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

  getPageItems(): void {
    const end: number = (this.currentPage + 1) * this.pageSize;
    const start: number = this.currentPage * this.pageSize;
    this.dataSource = this.offers.slice(start, end);
  }

  pageItemTrack(index: number, item: IOffer): number {
    return item.id;
  }

  optionTrack(index: number, item: string): string {
    return item;
  }

  pageChanged(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.totalItems = event.length;
    this.getPageItems();
  }

  filterOffers(searchTerm: string) {

    this.currentPage = 0;
    this.selectedValue = this.formFilters.get('selectedFilter').value;
    this.dataSource.filter = searchTerm.trim().toLocaleLowerCase();
    this.dataSource.filter = searchTerm.trim().toLowerCase();
    if (searchTerm != '') {
      if (this.selectedValue != 0) {
        this.subs.add(
        this.offersService.getOffersByProductNameAndCategoryId(searchTerm, this.selectedValue).subscribe(
          res => {
            this.processData(res);
          }
        ));
      } else {
        this.subs.add(
        this.offersService.getOfferByProductName(searchTerm).subscribe(
          res => {
            this.processData(res);
          }
        ));
      }
    } else {
      this.selectCategory(this.selectedValue);
    }

  }

  selectCategory(value: number) {

    this.searchTerm = this.formFilters.get('searchedFilter').value;
    this.currentPage = 0;
    if (value != 0) {
      if (this.searchTerm !== null && this.searchTerm !== '') {
        this.subs.add(
        this.offersService.getOffersByProductNameAndCategoryId(this.searchTerm, value).subscribe(
          res => {
            this.processData(res);
          }
        ))
      } else {
        this.subs.add(
        this.offersService.getOffersByCategoryId(value).subscribe(
          res => {
            this.processData(res);
          }
        ))
      }
    } else {
      this.searchTerm = this.formFilters.get('searchedFilter').value;
      if (this.searchTerm !== null && this.searchTerm !== '') {
        this.subs.add(
        this.offersService.getOfferByProductName(this.searchTerm).subscribe(
          res => {
            this.processData(res);
          }
        ));
      } else {
        this.getAllOffers();
      }
    }
  }

  processData(res: IOffer[]): void {
    this.offers = res.filter(res => res.isActive && !res.isDeleted);
    this.dataSource = new MatTableDataSource<IOffer>(res);
    this.dataSource.paginator = this.paginator;
    this.totalItems = this.offers.length;
    this.getPageItems();
  }

  openOfferDetails(offer: IOffer) {
    this._router.navigate(['offer-details/' + offer.id]);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  setName(option: ICategory): string {
    if(option.parentCategory) {
      return option.parentCategory.name + ' > ' + option.name;
    } else {
      return option.name;
    }
  }
}

