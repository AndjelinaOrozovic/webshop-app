import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthenticationService} from "../shared/services/authentication.service";

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent implements OnInit {

  form: FormGroup;

  constructor(private _formBuilder: FormBuilder, private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.form = this._formBuilder.group(
      {
        activationCode: new FormControl('', Validators.required),
      }
    )
  }

  activate() {
    this.authenticationService.activate(this.form.value.activationCode);
  }
}
