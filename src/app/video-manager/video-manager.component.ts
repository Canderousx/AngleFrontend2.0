import {Component, OnDestroy, OnInit} from '@angular/core';
import {MaterialModule} from "../../shared/modules/material/material.module";
import {NgForOf, NgIf} from "@angular/common";
import {AuthenticationService} from "../../shared/services/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SimpleDatePipe} from "../../shared/pipes/simple-date.pipe";
import {MouseEnterDirective} from "../../shared/directives/mouse-enter.directive";
import {serverResponse} from "../app.component";
import {Title} from "@angular/platform-browser";
import {UploadComponent} from "../upload/upload.component";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {VideoService} from "../../shared/services/video.service";
import {Video} from "../../shared/models/video";
import {account} from "../../shared/models/account";
import {environment} from '../../environments/environment.development';
import {ToastrService} from 'ngx-toastr';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-video-manager',
  standalone: true,
  imports: [MaterialModule, NgIf, NgForOf,SimpleDatePipe, MouseEnterDirective, UploadComponent, MatProgressSpinner],
  templateUrl: './video-manager.component.html',
  styleUrl: './video-manager.component.css'
})
export class VideoManagerComponent implements OnInit,OnDestroy{

  authSub!: Subscription;
  accountVideos!: Video[];
  currentUser!: account;
  paramId!: string;
  totalVideos = 0;
  page = 0;
  pageSize = 10;

  constructor(private videoService: VideoService,
              private auth: AuthenticationService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private toast: ToastrService,
              private titleService: Title) {
  }

  //LIFECYCLE HOOKS:

  ngOnInit() {
    this.titleService.setTitle("Videos Manager")
    this.authSub = this.auth.currentUser.subscribe(user => {
      if(user){
        this.currentUser = user;
        this.loadVideos();
      }else {
        this.router.navigate(["/"])
      }
    })
  }

  ngOnDestroy() {
    if(this.authSub){
      this.authSub.unsubscribe();
    }
  }


  //DOWNLOADING DATA FROM API:

  loadVideos(){
    this.accountVideos = [];
    this.activatedRoute.queryParams.subscribe({
      next: params => {
        this.paramId = params['id'];
        if(this.paramId === this.currentUser.id){
          this.videoService.getCurrentUserVideos(this.page,this.pageSize).subscribe({
            next: value => {
              this.totalVideos = value.totalElements;
              this.accountVideos = value.content;
            }
          })
        }else{
          this.router.navigate(["/"])
        }
      },
    })

  }


  //ACTIONS:

  deleteVideo(id: string){
    this.videoService.deleteVideo(id).subscribe({
      next: value => {
        this.loadVideos();
        this.toast.info(value.message)

      },
      error: err => {
        let errMsg: serverResponse = err.error;
        this.toast.error(errMsg.message)
      }
    })
  }

  editVideo(id: string){
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['upload/metadata'], { queryParams: { v: id, existing: true } })
    );
    window.open(url,"_blank");
  }



  protected readonly environment = environment;
}
