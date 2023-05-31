import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CategoriesService} from "../shared/services/categories.service";
import {AuthenticationService} from "../shared/services/authentication.service";
import {PurchasesService} from "../shared/services/purchases.service";
import {IUserAccount} from "../shared/models/IUserAccount";
import {IPurchase} from "../shared/models/IPurchase";
import {Subscription} from "rxjs";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {IOffer} from "../shared/models/IOffer";
import {MatTableDataSource} from "@angular/material/table";

const DEFAULT_PAGE_SIZE = 4;

@Component({
  selector: 'app-my-purchases',
  templateUrl: './my-purchases.component.html',
  styleUrls: ['./my-purchases.component.scss']
})
export class MyPurchasesComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  dataSource: any;
  user: IUserAccount;
  myPurchases: IPurchase[] = [];
  subs: Subscription = new Subscription();
  totalItems: number;
  pageSize: number = DEFAULT_PAGE_SIZE;
  currentPage: number = 0;

  constructor(
    private purchasesService: PurchasesService,
    private categoriesService: CategoriesService,
    private authenticationService: AuthenticationService,
  ) {
  }

  ngOnInit(): void {
    this.getAllPurchases();
  }

  getAllPurchases(): void {

    if (this.authenticationService.activeUser?.id) {
      this.user = this.authenticationService.activeUser;
      this.subs.add(
        this.purchasesService.findPurchaseByUserId(this.user.id).subscribe(res => {
          this.processData(res);
        })
      );
    }

  }

  processData(res: IPurchase[]): void {
    this.myPurchases = res;
    this.dataSource = new MatTableDataSource<IPurchase>(res);
    this.dataSource.paginator = this.paginator;
    this.totalItems = this.myPurchases.length;
    this.getPageItems();
  }

  getPageItems(): void {
    const end: number = (this.currentPage + 1) * this.pageSize;
    const start: number = this.currentPage * this.pageSize;
    this.dataSource = this.myPurchases.slice(start, end);
  }

  pageChanged(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.totalItems = event.length;
    this.getPageItems();
  }

  pageItemTrack(index: number, item: IOffer): number {
    return item.id;
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
