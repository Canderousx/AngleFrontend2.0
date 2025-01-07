import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Report} from "../../../../shared/models/report";
import {SimpleDatePipe} from "../../../../shared/pipes/simple-date.pipe";
import {Comment} from "../../../../shared/models/comment";
import {environment} from "../../../../environments/environment.development";
import {MouseEnterDirective} from "../../../../shared/directives/mouse-enter.directive";
import {Router, RouterLink} from "@angular/router";
import {NgClass, NgIf} from "@angular/common";
import {DateFormatPipe} from "../../../../shared/pipes/date-format.pipe";
import {NextLinerPipe} from "../../../../shared/pipes/next-liner.pipe";
import {RowcutPipe} from "../../../../shared/pipes/rowcut.pipe";
import {MatDivider} from "@angular/material/divider";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MaterialModule} from "../../../../shared/modules/material/material.module";
import {serverResponse} from "../../../app.component";
import {GlobalMessengerService} from "../../../../shared/services/global-messenger.service";
import {account} from "../../../../shared/models/account";
import {AuthenticationService} from "../../../../shared/services/authentication.service";
import {Video} from "../../../../shared/models/video";
import {VideoService} from "../../../../shared/services/video.service";
import {CommentsService} from '../../../../shared/services/comments.service';
import {ReportService} from '../../../../shared/services/report.service';
import {ReportSolution} from '../../../../shared/models/reportSolution';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-view-report',
  standalone: true,
  imports: [
    SimpleDatePipe,
    MouseEnterDirective,
    NgIf,
    DateFormatPipe,
    NextLinerPipe,
    MaterialModule,
    RowcutPipe,
    MatDivider,
    FormsModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './view-report.component.html',
  styleUrl: './view-report.component.css'
})
export class ViewReportComponent implements OnInit{

  constructor(private toast: ToastrService,
              private commentsService: CommentsService,
              private videoService: VideoService,
              private reportService: ReportService,) {
  }

  @Input()report!: Report;
  @Output()solved = new EventEmitter();
  reportedVideo!: Video;
  reportedComment!: Comment;
  maxLength = 35;
  rowLength = 120;
  toggleSolve = false;

  solveForm = new FormGroup({
    reason: new FormControl("", [Validators.required]),
  })

  toggleSolvePanel(){
    this.toggleSolve = !this.toggleSolve;
  }
  solveReport(submitter: string){
    if(this.solveForm.valid){
      let solutionType = "";
      if(submitter === 'media'){
        solutionType = "MEDIA_BANNED"
      }
      if(submitter === 'account'){
        solutionType = "ACCOUNT_BANNED"
      }
      if(submitter === 'cancel'){
        solutionType = "CANCELED"
      }
      const reportSolution: ReportSolution = {
        reportId: this.report.id!,
        solution: solutionType,
        reason: this.solveForm.controls.reason.value!
      }
      this.reportService.solveReport(reportSolution).subscribe({
        next: value => {
          this.toast.info(value.message);
          this.toggleSolvePanel();
          this.solved.emit();
        },
        error: err => {
          let error: serverResponse = err.error;
          this.toast.error(error.message)
        }
      })
    }
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

  ngOnInit() {
    if(this.report.type === 'video'){
      this.videoService.getVideo(this.report.mediaId!).subscribe({
        next: value => {
          this.reportedVideo = value;
        }
      })

    }
    if(this.report.type === 'comment'){
      this.commentsService.getComment(this.report.mediaId!).subscribe({
        next: value => {
          this.reportedComment = value;
        }
      })
    }
  }

  protected readonly environment = environment;
}
