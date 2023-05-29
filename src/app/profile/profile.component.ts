import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {AuthenticationService} from "../shared/services/authentication.service";
import {IUserAccount} from "../shared/models/IUserAccount";
import {UsersService} from "../shared/services/users.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  activeUser: IUserAccount;
  form: FormGroup;
  subs = new Subscription();

  constructor(private _formBuilder: FormBuilder,
              private _toast: ToastrService,
              private authenticationService: AuthenticationService,
              private userService: UsersService) {

  }

  ngOnInit(): void {
    this.activeUser = this.authenticationService.activeUser;
    this.form = this._formBuilder.group({
      name: new FormControl(this.activeUser.firstName, Validators.required),
      surname: new FormControl(this.activeUser.lastName, Validators.required),
      city: new FormControl(this.activeUser.city, Validators.required),
      username: new FormControl(this.activeUser.username, Validators.required),
      password: new FormControl(this.activeUser.password, Validators.required),
      passwordConfirm: new FormControl('', Validators.required),
      email: new FormControl(this.activeUser.mail, [Validators.required, Validators.email]),
      avatar: new FormControl(this.activeUser.avatar),
    })
  }

  save() {
    let name = this.form.value.name;
    let surname = this.form.value.surname;
    let city = this.form.value.city;
    let username = this.form.value.username;
    let password = this.form.value.password;
    let passwordConfirm = this.form.value.passwordConfirm;
    let email = this.form.value.email;
    let avatar = this.form.value.avatar;

    if (password === passwordConfirm) {
      let updatedUser: IUserAccount = {
        id: this.activeUser.id,
        firstName: name,
        lastName: surname,
        username: username,
        password: password,
        city: city,
        mail: email,
        pin: this.activeUser.pin,
        isActivated: this.activeUser.isActivated,
        isDeleted: this.activeUser.isDeleted,
        avatar: avatar
      };
      this.subs.add(
        this.userService.update(updatedUser).subscribe({
          next: (res: IUserAccount) => {
            this.authenticationService.activeUser = res;
            this._toast.success('Profile updated successfully!');
          },
          error: () => this._toast.error('Error while updating profile! Please try again!')
        }));
    } else {
      this._toast.error('Wrong password confirmation!');
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
