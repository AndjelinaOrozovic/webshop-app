import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CategoriesService} from "../shared/services/categories.service";
import {ICategory} from "../shared/models/ICategory";
import {IOffer} from "../shared/models/IOffer";
import {OffersService} from "../shared/services/offers.service";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";

const DEFAULT_PAGE_SIZE = 4;

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  dataSource: any;

  searchTerm: string = "";
  categories: ICategory[] = [];
  offers: IOffer[] = [];
  totalItems: number;
  pageSize: number = DEFAULT_PAGE_SIZE;
  currentPage: number = 0;
  selectedValue: number = 0;

  constructor(private categoriesService: CategoriesService,
              private offersService: OffersService) {
  }

  ngOnInit() {
    this.getCategories();
    this.getAllOffers();
  }

  getCategories(): void {
    this.categoriesService.getAll().subscribe(
      res => {
        this.categories = res;
        console.log(this.categories);
        this.categories.unshift({id: 0, name: 'All', parentCategory: null, isDeleted: false});
      }
    );
  }

  getAllOffers(): void {
    this.offersService.getAll().subscribe(
      res => {
        this.processData(res);
      }
    );
  }

  getPageItems(): void {
    const end: number = (this.currentPage + 1) * this.pageSize;
    const start: number = this.currentPage * this.pageSize;
    const part: IOffer[] = this.offers.slice(start, end);
    this.dataSource = part;
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
    console.log('aa');

    this.dataSource.filter = searchTerm.trim().toLocaleLowerCase();
    const filterValue = searchTerm;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (searchTerm != '') {
      this.offersService.getOfferByProductName(searchTerm).subscribe(
        res => {
          this.processData(res);
        }
      );
    } else {
      this.selectCategory(this.selectedValue);
    }

  }

  selectCategory(value: number) {

    if (value != 0) {
      if (this.searchTerm != '') {
        this.offersService.getOffersByProductNameAndCategoryId(this.searchTerm, value).subscribe(
          res => {
            this.processData(res);
          }
        )
      } else {
        this.offersService.getOffersByCategoryId(value).subscribe(
          res => {
            this.processData(res);
          }
        )
      }
    } else {
      this.searchTerm = '';
      this.getAllOffers();
    }
  }

  processData(res: IOffer[]): void {
    this.offers = res;
    this.dataSource = new MatTableDataSource<IOffer>(res);
    this.dataSource.paginator = this.paginator;
    this.totalItems = res.length;
    this.getPageItems();
  }

}

