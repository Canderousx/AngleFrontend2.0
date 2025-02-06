import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Comment} from "../../models/comment";
import {NgForOf, NgIf} from "@angular/common";
import {MaterialModule} from "../../modules/material/material.module";
import {Router, RouterLink} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DateFormatPipe} from "../../pipes/date-format.pipe";
import {SimpleDatePipe} from "../../pipes/simple-date.pipe";
import {MouseEnterDirective} from "../../directives/mouse-enter.directive";
import {NextLinerPipe} from "../../pipes/next-liner.pipe";
import {serverResponse} from "../../../app/app.component";
import {CommentsService} from "../../services/comments.service";
import {account} from "../../models/account";
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../../environments/environment.development';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [
    NgIf,
    MaterialModule,
    RouterLink,
    ReactiveFormsModule,
    NgForOf,
    DateFormatPipe,
    SimpleDatePipe,
    MouseEnterDirective,
    NextLinerPipe
  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit, OnChanges,OnDestroy{

  constructor(private commentsService: CommentsService,
              private auth: AuthenticationService,
              private router: Router,
              private toast: ToastrService) {
  }

  @Input() videoId!: string;
  authSub!: Subscription;
  user!: account;
  comments: Comment[] = [];
  totalComments = 0;
  page = 0;
  pageSize = 10;
  loggedIn = false;
  maxLength = 35;
  rowLength = 120;

  commentForm = new FormGroup({
    content: new FormControl("",Validators.compose([Validators.required])),
  })

  //LIFECYCLE HOOKS:

  ngOnInit() {
    this.loadComments();
    this.checkLogin();
    this.authSub = this.auth.currentUser.subscribe({
      next: value => {
        if(value){
          this.user = value;
        }
      }
    })
  }

  ngOnDestroy() {
    if(this.authSub){
      this.authSub.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['videoId']){
      this.loadComments();
    }
  }

  // DOWNLOADING DATA FROM API:

  loadComments(){
    this.comments = [];
    this.commentsService.loadComments(this.videoId,this.page,this.pageSize)
      .subscribe({
        next: value => {
          this.totalComments = value.totalElements;
          this.comments = value.content;
        }
      })
  }

  // ACTIONS:

  addComment(){
    this.page = 0;
    if(this.commentForm.controls.content.value && this.user!==null){
      let comment: Comment = {
        content: this.commentForm.controls.content.value,
        authorId: this.user.id,
        authorName: this.user.username,
        videoId: this.videoId,
      }
      this.commentForm.controls.content.reset();
      this.commentsService.addComment(comment)
        .subscribe({
          next: value => {
            this.toast.info(value.message)
            comment.datePublished = new Date().toString();
            this.comments.unshift(comment);
            this.totalComments++;
          }
        })
    }
  }

  delete(id: string | undefined){
    this.commentsService.deleteComment(id!)
      .subscribe({
        next: value => {
          this.toast.info(value.message)
          this.loadComments();
        },
        error: err => {
          let error: serverResponse = err.error;
          this.toast.error(error.message);
        }
      })
  }

  report(id: string | undefined){
    this.router.navigate(["/report"],{queryParams:{id: id,type:"comment",src: this.router.url}})
  }

  signin(){
    localStorage.setItem("prevURL",this.router.url);
    this.router.navigate(['signin'])
  }


  // UI:

  resizeComment(comment: Comment){
    comment.extended = !comment.extended;
  }

  shortenComment(comment: Comment){
    if(!comment.extended){
      return comment.content.slice(0,this.rowLength);
    }
    return comment.content;
  }

  moreComments(){
    this.page++;
    this.commentsService.loadComments(this.videoId,this.page,this.pageSize);
  }


  checkLogin(){
    this.auth.currentUser.subscribe({
      next: value => {
        this.loggedIn = !!value;
      }
    })
  }


  protected readonly environment = environment;
}
