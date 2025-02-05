import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {VideoPlayerComponent} from "../video-player/video-player.component";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {environment} from "../../environments/environment.development";
import {NgClass, NgIf} from "@angular/common";
import {AuthenticationService} from "../../shared/services/authentication.service";
import {MaterialModule} from "../../shared/modules/material/material.module";
import {MouseEnterDirective} from "../../shared/directives/mouse-enter.directive";
import {CommentsComponent} from "../../shared/components/comments/comments.component";
import {DateFormatPipe} from "../../shared/pipes/date-format.pipe";
import {SimpleDatePipe} from "../../shared/pipes/simple-date.pipe";
import {FeedComponent} from "../../shared/components/feed/feed.component";
import {NextLinerPipe} from "../../shared/pipes/next-liner.pipe";
import {Title} from "@angular/platform-browser";
import {SubscribeService} from "../../shared/services/subscribe.service";
import {VideoService} from "../../shared/services/video.service";
import {Video} from "../../shared/models/video";
import {account} from "../../shared/models/account";
import {StatsService} from '../../shared/services/stats.service';

@Component({
  selector: 'app-watch',
  standalone: true,
  imports: [
    VideoPlayerComponent,
    NgIf,
    MaterialModule,
    MouseEnterDirective,
    CommentsComponent,
    DateFormatPipe,
    SimpleDatePipe,
    NgClass,
    FeedComponent,
    NextLinerPipe,
  ],
  templateUrl: './watch.component.html',
  styleUrl: './watch.component.css'
})
export class WatchComponent implements OnInit, OnDestroy{
  constructor(private videoService: VideoService,
              private statsService: StatsService,
              private activatedRoute: ActivatedRoute,
              private auth: AuthenticationService,
              private router: Router,
              private titleService: Title,
              private subscribeService: SubscribeService) {
  }

  videoUrl: string = "";
  video!: Video;
  similarVideos!: Video[];
  author!: account;
  currentUser!: account | null;
  rated = false;
  rating!: string;
  videoLikes = 0;
  videoDislikes = 0;
  isBanned = false;


  descClass = "short"
  descMaxLength = 80;
  hover = false;

  queryParamSub!: Subscription;
  authSub!: Subscription;
  subSub!: Subscription;


  //LIFECYCLE HOOKS:

  ngOnInit() {
    this.subToVideoIdQueryParam();
    this.subToCurrentUser();
  }

  ngOnDestroy() {
    if(this.authSub){
      this.authSub.unsubscribe();
    }
    if(this.subSub){
      this.subSub.unsubscribe();
    }
  }

  //DOWNLOADING DATA FROM API:
  loadVideoUrl(){
    this.videoUrl = environment.backendUrl+'/api/video-manager/videos/watch/'+this.video.id+'/'+this.video.playlistName;
  }

  getVideo(id: string){
    this.videoService.getVideo(id)
      .subscribe({
        next: value => {
          this.video = value;
          this.isBanned = false;
          this.loadVideoUrl();
          this.titleService.setTitle(this.video.name)
          if(this.currentUser && this.currentUser.id === this.video.authorId){
            this.author = this.currentUser;
          }else{
            this.getAuthor();
          }
          this.checkIfChannelSubscribed();
          this.isVideoRated();
          this.getSimilarVideos();
        },
        error: err => {
          if(err.status === 666){
            this.isBanned = true;
          }
        }
      })
  }

  checkIfChannelSubscribed(){
    if(this.currentUser && this.video.authorId !== this.currentUser.id){
      this.subSub = this.subscribeService.subscribed.subscribe({
        next: value => {
          this.author.subscribed = value;
        }
      })
    }
  }

  getVideoStats(){
    this.statsService.getVideoStats(this.video.id).subscribe({
      next: value => {
        this.videoLikes = value.likes;
        this.videoDislikes = value.dislikes;
        if(this.rated){
          if(this.rating === 'LIKE' && this.videoLikes === 0){
            this.videoLikes++;
          }else if (this.rating === 'DISLIKE' && this.videoDislikes === 0){
            this.videoDislikes++;
          }
        }
      }
    })
  }

  getSimilarVideos(){
    this.similarVideos = [];
    this.videoService.getSimilarVideos(this.video.id)
      .subscribe({
        next: value => {
          this.similarVideos = value;
        }
      })
  }

  getAuthor(){
    this.videoService.getAuthor(this.video.authorId)
      .subscribe({
        next: value => {
          this.author = value;
          if(!!localStorage.getItem("authToken")){
            this.subscribeService.isSubscriber(this.author.id)
              .subscribe({
                next: value =>{
                  this.author.subscribed = value;
                },
                error: err => {
                  this.author.subscribed = false;
                }
              })
          }
        },
        error: err => {
          console.log(err.error);
        }
      })
  }

  isVideoRated(){
    if(this.currentUser){
      this.statsService.checkRate(this.video.id)
        .subscribe({
          next: value => {
            this.rating = value.rating;
            this.rated = value.rating.toLowerCase() !== "none";
            this.getVideoStats();
          }
        })
    }
  }




  //SUBSCRIPTIONS TO SERVICES:

  subToCurrentUser(){
    this.authSub = this.auth.currentUser.subscribe({
      next: value =>{
        this.currentUser = value;
      }
    })
  }

  subToVideoIdQueryParam(){
    this.queryParamSub = this.activatedRoute.queryParams.subscribe({
        next: value => {
          this.getVideo(value['v']);
        }
      }
    )
  }

  // ACTIONS:

  subscribeChannel(action: boolean){
    if(action){
      this.subscribeService.subscribe(this.author.id);
      return;
    }
    this.hover = false;
    this.subscribeService.unsubscribe(this.author.id);
  }

  rateVideo(rate: string){
    this.statsService.rateVideo(this.video.id,rate)
      .subscribe({
        next: value => {
          if(this.rated){
            if(this.rating === 'LIKE'){
              console.log('removing like')
              this.videoLikes --;
            }
            if(this.rating === "DISLIKE"){
              console.log('removing dislike')
              this.videoDislikes --;
            }
          }
          if(rate === 'LIKE'){
            console.log('adding like')
            this.videoLikes ++;
          }
          if(rate === 'DISLIKE'){
            console.log('adding dislike')
            this.videoDislikes ++;
          }
          this.rating = rate;
          if(rate !== "none"){this.rated = true;}
          console.log("NEW RATING: "+this.rating)
        }
      })
  }

  //NAVIGATIONS

  navigateToVideosManager(){
    if(this.currentUser)
      this.router.navigate(["manager"],{queryParams:{id:this.currentUser.id}})
  }

  navigateToEditVideo(){
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['upload/metadata'], { queryParams: { v: this.video.id, existing: true } })
    );
    window.open(url,"_blank");
  }

  navigateToAuthorPage(){
    this.router.navigate(["/channel"],{queryParams: {id: this.author.id}})
  }

  navigateToReport(){
    this.router.navigate(["/report"],{queryParams:{id: this.video.id,type:"video",src: this.router.url}})
  }





  //UI

  getShorterDescription(desc: string){
    if(desc.includes("\n")){
      return desc.slice(0,desc.indexOf("\n"))
    }
    return desc.slice(0,this.descMaxLength);
  }

  expandDescription(){
    this.descClass = "expanded"
  }
  shortDescription(){
    this.descClass = "short";
  }

  onMouseEnter(){
    this.hover = true;
  }

  onMouseLeave(){
    this.hover = false;
  }

    protected readonly environment = environment;
}
