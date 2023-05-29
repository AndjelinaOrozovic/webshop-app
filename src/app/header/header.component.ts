import { Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from "../shared/services/authentication.service";
import {combineLatest, Subscription} from "rxjs";
import {IUserAccount} from "../shared/models/IUserAccount";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  signedIn = false;
  userAccount: IUserAccount = null;
  subs = new Subscription();
  logOutText: string = 'Log out';

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    let signedObs = this.authenticationService.isSignedIn$;
    let activatedObs = this.authenticationService.isActivated$;
    let activeUserObs = this.authenticationService.activeUser$;
    this.subs.add(
      combineLatest([signedObs, activatedObs, activeUserObs]).subscribe(data => {
        this.signedIn = data[0] && data[1];
        this.userAccount = data[2];
      }));
  }

  public logout() {
    this.authenticationService.logout();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
