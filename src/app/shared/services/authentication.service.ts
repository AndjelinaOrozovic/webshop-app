import {Injectable} from '@angular/core';
import {IUserAccount} from "../models/IUserAccount";
import {UsersService} from "./users.service";
import {Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {EmailService} from "./email.service";
import {HttpErrorResponse} from "@angular/common/http";
import {Subject} from "rxjs";
import {IMail} from "../models/IMail";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  activeUser: IUserAccount | null;
  _activeUser = new Subject<IUserAccount>();
  activeUser$ = this._activeUser.asObservable();
  signedIn = false;
  _isSignedIn = new Subject<boolean>();
  isSignedIn$ = this._isSignedIn.asObservable();
  activated = false;
  _isActivated = new Subject<boolean>();
  isActivated$ = this._isActivated.asObservable();
  users: IUserAccount[];

  constructor(private usersService: UsersService,
              private _router: Router,
              private _toast: ToastrService,
              private emailService: EmailService) {
    this.usersService.getAll().subscribe(res => this.users = res);
  }

  loginUser(username: string, password: string): void {
    this.usersService.findByUsername(username).subscribe({
      next: (res: IUserAccount) => {
        if (res.password === password) {
          this.activeUser = res;
          this._activeUser.next(res);
          this.signedIn = true;
          this._isSignedIn.next(true);
          this.activated = res.isActivated;
          this._isActivated.next(res.isActivated);

          if (!res.isActivated) {
            this.sendNewPIN();
          } else {
            this._router.navigate(['']);
          }
        } else {
          this._toast.error('Wrong password!');
        }
      },
      error: (err: HttpErrorResponse) => {

        if (err.status === 404) {
          this._toast.error('Wrong username!');
        } else {
          this._toast.error('Error! Please try again!');
        }

      }
    });
  }

  sendNewPIN(): void {
    let newPIN = this.generatePIN();
    if (this.activeUser) {
      this.activeUser.pin = String(newPIN);
      this.usersService.update(this.activeUser).subscribe({
        next: (res: IUserAccount) => {
          this.emailService.send({receiver: res.mail, content: res.pin}).subscribe();
          this.activeUser = res;
          this._activeUser.next(res);
          this._toast.warning('Please activate your profile!');
          this._router.navigate(['activation']);
        },
        error:() => {
          this._toast.error("Error while sending mail!");
          this._router.navigate(['login']);
        }
      })

    }
  }

  generatePIN(): string {
    let min = 1000;
    let max = 9999;

    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor(rand * difference);
    rand = rand + min;
    return rand + '';
  }

  logout(): void {
    this.activeUser = null;
    this._activeUser.next(null);
    this.signedIn = false;
    this._isSignedIn.next(false);
    this.activated = false;
    this._isActivated.next(false);
    this._router.navigate(['']);
  }

  register(user: IUserAccount) {
    this.usersService.insert(user).subscribe({
      next: (res: IUserAccount) => {
        this.activeUser = res;
        this._activeUser.next(res);
        this.signedIn = true;
        this._isSignedIn.next(true);
        this.activated = false;
        this._isActivated.next(false);

        this.emailService.send(<IMail>{receiver: res.mail, content: res.pin}).subscribe();
        this._toast.success('Registration is completed!');
        this._router.navigate(['activation']);
      },
      error:(res: HttpErrorResponse) => {
        if(res.status === 409) {
          this._toast.error('Username already exists!');
        } else {
          this._toast.error('Error! Please try again!');
        }
      }
    });
  }

  activate(pin: string) {
    if(this.activeUser && pin === this.activeUser.pin) {
      this.activeUser.isActivated = true;
      this.usersService.update(this.activeUser).subscribe( {
        next: (res: IUserAccount) => {
          this.activeUser = res;
          this._activeUser.next(res);
          this.activated = true;
          this._isActivated.next(true);

          this._toast.success('Activation is completed!');
          this._router.navigate(['']);
        },
        error: (res: HttpErrorResponse) => {
          this._toast.error('Error while activating profile!');
        }
      })
    }
  }
}
