import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../shared/services/authentication.service";
import {IUserAccount} from "../shared/models/IUserAccount";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;

  constructor(private _formBuilder: FormBuilder,
              private _toast: ToastrService,
              private authenticationService: AuthenticationService) {

  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      passwordConfirm: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      avatar: new FormControl(null),
    })
  }

  register() {
    let name = this.form.value.name;
    let surname = this.form.value.surname;
    let city = this.form.value.city;
    let username = this.form.value.username;
    let password = this.form.value.password;
    let passwordConfirm = this.form.value.passwordConfirm;
    let email = this.form.value.email;
    let avatar = this.form.value.avatar;

    if (password === passwordConfirm) {
      let registeredUser: IUserAccount = {
        id: null,
        firstName: name,
        lastName: surname,
        username: username,
        password: password,
        city: city,
        mail: email,
        pin: this.authenticationService.generatePIN(),
        isActivated: false,
        isDeleted: false,
        avatar: avatar
      };
      this.authenticationService.register(registeredUser);
    } else {
      this._toast.error('Wrong password confirmation!');
    }
  }
}
