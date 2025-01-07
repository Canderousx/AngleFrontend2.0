import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {Comment} from "../../models/comment";
import {DateFormatPipe} from "../../pipes/date-format.pipe";
import {RowcutPipe} from "../../pipes/rowcut.pipe";
import {SimpleDatePipe} from "../../pipes/simple-date.pipe";
import {MaterialModule} from "../../modules/material/material.module";
import {MatInput} from "@angular/material/input";
import {MatSelect} from "@angular/material/select";
import {MouseEnterDirective} from "../../directives/mouse-enter.directive";
import {NextLinerPipe} from "../../pipes/next-liner.pipe";
import {Title} from "@angular/platform-browser";
import {serverResponse} from "../../../app/app.component";
import {ReportService} from "../../services/report.service";
import {VideoService} from "../../services/video.service";
import {CommentsService} from "../../services/comments.service";
import {Video} from "../../models/video";
import {ToastrService} from 'ngx-toastr';
import {Report} from '../../models/report';
import {environment} from '../../../environments/environment.development';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    NgIf,
    DateFormatPipe,
    RowcutPipe,
    SimpleDatePipe,
    MaterialModule,
    ReactiveFormsModule,
    NgForOf,
    MatInput,
    MatSelect,
    MouseEnterDirective,
    NextLinerPipe
  ],
  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit, OnDestroy{

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private reportService: ReportService,
              private videoService: VideoService,
              private commentsService: CommentsService,
              private title: Title,
              private toast: ToastrService) {
  }

  type!: string;
  mediaId!: string;
  reportedAccountId!: string;
  prevUrl!: string;
  sub!: Subscription;
  categories: string[] = [];
  reportedVideo!: Video;
  reportedComment!: Comment;
  maxLength = 35;
  rowLength = 120;

  reportForm = new FormGroup({
    category: new FormControl<string>('',Validators.required),
    content: new FormControl<string>('',Validators.required),
  })


  //LIFECYCLE HOOKS:

  ngOnInit() {
    this.title.setTitle("Report Form")
    this.sub = this.activatedRoute.queryParams.subscribe({
      next: params =>{
        this.type = params['type'];
        this.prevUrl = params['src'];
        this.mediaId = params['id'];
        this.getCategories();
        this.getMedia();

      }
    })
  }
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  //DOWNLOADING DATA FROM API:

  getCategories() {
    this.reportService.getCategories().subscribe({
      next: value => {
        this.categories = value;
      }
    })
  }
  getMedia(){
    if(this.type === 'video'){
      this.videoService.getVideo(this.mediaId)
        .subscribe({
          next: value => {
            this.reportedVideo = value;
            this.reportedAccountId = value.authorId;
            console.log("Received video: "+this.reportedVideo.name)
          }
        })
    }else{
      this.commentsService.getComment(this.mediaId)
        .subscribe({next: value => {
            this.reportedComment = value;
            this.reportedAccountId = value.authorId;
            console.log("Received comment by: "+this.reportedComment.authorName)
          }});
    }

  }

  //ACTIONS:

  sendReport(){
    if(this.reportForm.valid){
      const report: Report = {
        reportedAccountId:this.reportedAccountId,
        content: this.reportForm.controls.content.value!,
        category: this.reportForm.controls.category.value!,
        type: this.type,
        mediaId: this.mediaId};
      this.reportService.sendReport(report)
        .subscribe({
          next: value => {
            this.toast.info(value.message)
            this.abort();
          },
          error: err => {
            console.log(err)
            let ms: serverResponse = err.error;
            this.toast.error(ms.message)
          }
        })
    }


  }

  abort(){
    this.router.navigateByUrl(this.prevUrl);
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
  


  protected readonly environment = environment;
}
