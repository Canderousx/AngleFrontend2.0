import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {environment} from '../../../environments/environment.development';
import {MaterialModule} from '../../modules/material/material.module';
import {Comment} from '../../models/comment';
import {CommentsService} from '../../services/comments.service';
import {AuthenticationService} from '../../services/authentication.service';
import {Subscription} from 'rxjs';
import {account} from '../../models/account';
import {serverResponse} from '../../../app/app.component';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {SimpleDatePipe} from '../../pipes/simple-date.pipe';
import {DateFormatPipe} from '../../pipes/date-format.pipe';
import {NextLinerPipe} from '../../pipes/next-liner.pipe';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MouseEnterDirective} from '../../directives/mouse-enter.directive';

@Component({
  selector: 'app-single-comment',
  imports: [
    MaterialModule,
    SimpleDatePipe,
    DateFormatPipe,
    NextLinerPipe,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgForOf,
    MouseEnterDirective
  ],
  templateUrl: './single-comment.component.html',
  standalone: true,
  styleUrl: './single-comment.component.css'
})
export class SingleCommentComponent implements OnInit,OnDestroy{

  constructor(private commentsService: CommentsService,
              private authService: AuthenticationService,
              private toast: ToastrService,
              private router: Router) {
  }

  commentForm = new FormGroup({
    content: new FormControl("",Validators.compose([Validators.required])),
  })

  @Input() comment!: Comment
  @Input() index!: number;
  @Output() deleteEvent = new EventEmitter<number>();
  @Output() newCommentEvent = new EventEmitter<Comment>();
  replies: Comment[] = [];
  totalReplies = 0;
  authSub!: Subscription;
  user!: account;
  maxLength = 35;
  rowLength = 120;
  replyMode = false;
  page = 0;
  pageSize = 3;

  ngOnInit() {
    this.authSub = this.authService.currentUser.subscribe({
      next: value => {
        if(value){
          this.user = value;
        }
      }
    })
    this.loadReplies();

  }

  ngOnDestroy() {
    if(this.authSub){
      this.authSub.unsubscribe();
    }
  }

  loadReplies(){
    this.commentsService.loadReplies(this.comment.id!,this.page,this.pageSize)
      .subscribe({
        next: value => {
          this.totalReplies = value.totalElements;
          if(this.replies.length > 0){
            this.replies.push(...value.content)
          }else{
            this.replies = value.content;
          }
        }
      })
  }

  loadMore(){
    if(this.totalReplies > this.replies.length){
      this.page++;
      this.loadReplies();
    }
  }


  delete(){
    this.commentsService.deleteComment(this.comment.id!)
      .subscribe({
        next: value => {
          this.toast.info(value.message)
          this.deleteEvent.emit(this.index)
        },
        error: err => {
          let error: serverResponse = err.error;
          this.toast.error(error.message);
        }
      })
  }

  deleteReply(){

  }

  addComment(){
    this.page = 0;
    if(this.commentForm.controls.content.value && this.user!==null){
      let comment: Comment = {
        content: this.commentForm.controls.content.value,
        authorId: this.user.id,
        authorName: this.user.username,
        videoId: this.comment.videoId,
        parentCommentId: this.comment.id,
        parentCommentAuthorId: this.comment.authorId
      }
      this.commentForm.controls.content.reset();

      this.commentsService.addComment(comment)
        .subscribe({
          next: value => {
            this.toggleReplyMode();
            this.toast.info(value.message)
            comment.datePublished = new Date().toString();
            this.replies.unshift(comment)
            this.totalReplies++;
            this.newCommentEvent.emit(comment)
          }
        })
    }
  }



  report(){
    this.router.navigate(["/report"],{queryParams:{id: this.comment.id,type:"comment",src: this.router.url}})
  }

  toggleReplyMode(){
    this.replyMode = !this.replyMode;
  }

  resizeComment(comment: Comment){
    comment.extended = !comment.extended;
  }

  shortenComment(comment: Comment){
    if(!comment.extended){
      return comment.content.slice(0,this.rowLength);
    }
    return comment.content;
  }

  protected readonly environment = environment;
}
