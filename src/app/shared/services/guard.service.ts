import { Injectable } from '@angular/core';
import {CanActivate, Router} from "@angular/router";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(private authenticationService: AuthenticationService,
              private _router: Router) { }

  canActivate(): boolean {
    if(this.authenticationService.signedIn && this.authenticationService.activated) {
      return true;
    } else if(this.authenticationService.signedIn && !this.authenticationService.activated) {
      this._router.navigate(['activation']);
      return false;
    }
    else {
      this._router.navigate(['']);
      return false;
    }
  }
}
