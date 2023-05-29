import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {IOffer} from "../shared/models/IOffer";
import {OffersService} from "../shared/services/offers.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CommentsService} from "../shared/services/comments.service";
import {IComment} from "../shared/models/IComment";
import {ToastrService} from 'ngx-toastr';
import {formatDate} from "@angular/common";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {catchError, Observable, Subscription, switchMap} from "rxjs";
import {AuthenticationService} from "../shared/services/authentication.service";

@Component({
  selector: 'app-offer-details',
  templateUrl: './offer-details.component.html',
  styleUrls: ['./offer-details.component.scss']
})
export class OfferDetailsComponent implements OnInit, OnDestroy {

  offer: IOffer;
  comments: IComment[];
  signedIn: boolean = false;
  format: string = 'yyyy/MM/dd hh:mm:ss';
  locale: string = 'en-US';
  successMessage = 'Comment added successfully!';
  errorMessage = 'Error while adding comment!';
  commentForm: FormGroup;
  subs = new Subscription();
  imageSources: string[];
  currentIndex = 0;
  viewer: any;
  noCommentsYet: string = 'No comments yet!';
  myOffer: boolean = false;

  constructor(private offersService: OffersService,
              private commentsService: CommentsService,
              private authenticationService: AuthenticationService,
              private router: Router,
              private _route: ActivatedRoute,
              private _formBuilder: FormBuilder,
              private _toastService: ToastrService,
              private _renderer: Renderer2) {
  }

  ngOnInit() {
    this.commentForm = this._formBuilder.group({
      textAreaComment: new FormControl('', Validators.required),
    });
    const offerId = this._route.snapshot.paramMap.get('id');
    this.subs.add(
      this.offersService.getOfferDetails(+offerId).subscribe(
        res => {
          this.offer = res;
          this.imageSources = res.product.images.map(res => res.url);
        }
      ));
    this.getComments(+offerId);
    this.signedIn = this.authenticationService.signedIn && this.authenticationService.activated;
    if(this.authenticationService.activeUser) {
      this.myOffer = this.authenticationService.activeUser.id === +offerId;
    }
  }

  showNextImage() {
    this.currentIndex++;
    if (this.currentIndex >= this.imageSources.length) {
      this.currentIndex = 0;
    }
    this.viewer.show(this.currentIndex);
  }

  leaveComment(comment: string) {
    let newComment: IComment = {
      id: null,
      content: comment,
      dateAndTime: formatDate(new Date(), this.format, this.locale),
      offer: this.offer,
      userAccount: this.authenticationService.activeUser
    }
    this.subs.add(
      this.commentsService.postComment(newComment).pipe(switchMap(() => {
          this._toastService.success(this.successMessage);
          return this.commentsService.getCommentsForOffer(this.offer.id)
        }
      ), catchError((error) => {
        this._toastService.error(this.errorMessage);
        return new Observable<null>();
      })).subscribe(
        res => {
          if (res != null) {
            this.comments = res;
          }
        }
      ));

    this.commentForm.reset();
  }

  getComments(offerId: number): void {
    this.subs.add(
      this.commentsService.getCommentsForOffer(offerId).subscribe(
        res => {
          this.comments = res;
        }
      ));
  }

  commentTrack(index: number, item: string): string {
    return item;
  }

  purchaseOffer(offer: IOffer) {
      this.offersService.setOffer(offer);
      this.router.navigate(['purchase']);
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
