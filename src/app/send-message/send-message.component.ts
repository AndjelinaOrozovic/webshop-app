import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MessagesService} from "../shared/services/messages.service";
import {AuthenticationService} from "../shared/services/authentication.service";
import {ToastrService} from "ngx-toastr";
import {Router} from "@angular/router";
import {formatDate} from "@angular/common";
import {IMessage} from "../shared/models/IMessage";

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss']
})
export class SendMessageComponent implements OnInit, OnDestroy {

  subs: Subscription = new Subscription();
  form: FormGroup;
  sender: string = "";
  senderId: number;
  format: string = 'yyyy/MM/dd hh:mm:ss';
  locale: string = 'en-US';

  constructor(private messagesService: MessagesService,
              private authenticationService: AuthenticationService,
              private _toast: ToastrService,
              private _router: Router,
              private _formBuilder: FormBuilder)
  {}

  ngOnInit(): void {

    if(this.authenticationService.activeUser) {
      this.sender = this.authenticationService.activeUser.username;
      this.senderId = this.authenticationService.activeUser.id;
    }
    this.form = this._formBuilder.group({
      sender: new FormControl(this.sender, Validators.required),
      receiver: new FormControl('Customer Support', Validators.required),
      content: new FormControl(null, Validators.required)
    });
    if(this.form.get('content').value === null || this.form.get('content').value === '') {
      this.form.invalid;
    }
  }

  sendMessageToCustomerSupport(): void {
    let content = this.form.get('content').value;
    let dateAndTime = formatDate(new Date(), this.format, this.locale);
    let message: IMessage = {id: null, content: content, isRead: false, dateAndTime: dateAndTime, idUserAccount: this.authenticationService.activeUser};

    this.subs.add(
      this.messagesService.insert(message).subscribe( {
        next: (): void => {
          this._toast.success('Message sent successfully!');
          this._router.navigate(['']);
        },
        error: (): void => {
          this._toast.error("Error while sending message!. Please try again!");
        }
      }
    ))
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

}
