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
import {SingleCommentComponent} from '../single-comment/single-comment.component';

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
    NextLinerPipe,
    SingleCommentComponent
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
  totalCommentsWithReplies = 0;
  page = 0;
  pageSize = 10;
  loggedIn = false;


  commentForm = new FormGroup({
    content: new FormControl("",Validators.compose([Validators.required])),
  })

  //LIFECYCLE HOOKS:

  ngOnInit() {
    this.page = 0;
    this.comments = [];
    this.loadComments();
    this.countAllComments();
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
    if(changes['videoId'] && !changes['videoId'].isFirstChange()){
      this.comments = [];
      this.page = 0;
      this.loadComments();
      this.countAllComments();
    }
  }

  // DOWNLOADING DATA FROM API:

  loadComments(){
    this.commentsService.loadComments(this.videoId,this.page,this.pageSize)
      .subscribe({
        next: value => {
          this.totalComments = value.totalElements;
          if(this.comments.length > 0){
            this.comments.push(...value.content)
          }else{
            this.comments = value.content;
          }
        }
      })
  }

  countAllComments(){
    this.commentsService.countAllComments(this.videoId).subscribe({
      next: value => {
        this.totalCommentsWithReplies = value;
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
            this.newCommentEvent(comment);
          }
        })
    }
  }

  newCommentEvent(comment: Comment){
    this.totalCommentsWithReplies++;
    if(!comment.parentCommentId){
      this.totalComments++;
      this.comments.unshift(comment);
    }
  }

  deleteEvent(index: number){
    this.comments.splice(index,1)
    this.totalComments--;
  }


  signin(){
    localStorage.setItem("prevURL",this.router.url);
    this.router.navigate(['signin'])
  }


  // UI:



  moreComments(){
    if(this.comments.length < this.totalComments){
      this.page++;
      this.loadComments();
    }
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
