import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {AuthenticationService} from "../../shared/services/authentication.service";
import {Subscription} from "rxjs";
import {MaterialModule} from "../../shared/modules/material/material.module";
import {NgIf} from "@angular/common";
import {FeedComponent} from "../../shared/components/feed/feed.component";
import {Title} from "@angular/platform-browser";
import {SubscribeService} from "../../shared/services/subscribe.service";
import {VideoService} from "../../shared/services/video.service";
import {account} from "../../shared/models/account";
import {Video} from "../../shared/models/video";
import {environment} from '../../environments/environment.development';

@Component({
  selector: 'app-channel',
  standalone: true,
  imports: [MaterialModule, NgIf, FeedComponent],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.css'
})
export class ChannelComponent implements OnInit, OnDestroy{

  constructor(private activatedRoute: ActivatedRoute,
              private auth: AuthenticationService,
              private router: Router,
              private titleService: Title,
              private subscribeService: SubscribeService,
              private videoService: VideoService,
              private authService: AuthenticationService,) {
  }
  currentUser: account | null = null;
  channelUser!: account
  channelId!: string;
  subscribers: number = 0;
  channelVideos!: Video[];
  sub!: Subscription;
  subSub!: Subscription;
  querySub!: Subscription;
  page = 0;
  pageSize = 12;
  totalVideos = 0;
  ownChannel = false;
  hover = false;

  //LIFECYCLE HOOKS:

  ngOnInit() {
    this.currentUserSub();

  }

  ngOnDestroy() {
    if(this.sub){
      this.sub.unsubscribe();
    }
    if(this.querySub){
      this.querySub.unsubscribe();
    }
    if(this.subSub){
      this.subSub.unsubscribe();
    }
  }


  //DOWNLOADING DATA FROM API:

  getUser(id: string){
    this.auth.getUser(id)
      .subscribe({
        next: value =>{
          if(value){
            this.channelUser = value;
            this.isSubscriber();
            this.titleService.setTitle(this.channelUser.username)
          }
        }
      })
  }

  loadVideos(){
    this.videoService.getUserVideos(this.channelId,this.page,this.pageSize).subscribe({
      next: value => {
        this.totalVideos = value.totalElements;
        this.channelVideos = value.content;
      }
    })
  }
  isSubscriber(){
    if(this.currentUser)
    this.subscribeService.isSubscriber(this.channelUser.id)
      .subscribe({
        next: value =>{
          this.channelUser.subscribed = value;
        },
        error: err => {
          this.channelUser.subscribed = false;
        }
      })
  }
  countSubscribers(){
    this.subscribeService.countSubscribers(this.channelId).subscribe({
      next: value => {
        this.subscribers = value;
      }
    })
  }

  //SUBS:
  currentUserSub(){
    this.sub = this.auth.currentUser.subscribe({
      next: value => {
        this.currentUser = value;
        this.queryParamSub();
      }
    })
  }

  channelSubscription(){
    this.subSub = this.subscribeService.subscribed.subscribe({
      next: value => {
        this.channelUser.subscribed = value;
      }
    })
  }

  queryParamSub(){
    this.querySub = this.activatedRoute.queryParams.subscribe(params =>{
      this.channelId = params['id'];
      this.countSubscribers();
      if(this.currentUser){
        this.ownChannel = this.channelId === this.currentUser.id;
      }
      this.channelSubscription();
      if(this.ownChannel && this.currentUser){
        this.channelUser = this.currentUser;
        this.titleService.setTitle(this.channelUser.username)
      }else{
        this.getUser(this.channelId)
      }
      this.loadVideos();
    })

  }


  //ACTIONS:

  subscribe(action: boolean){
    if(action){
      this.subscribeService.subscribe(this.channelUser.id);
      this.subscribers+=1;
      return;
    }
    this.hover = false;
    this.subscribeService.unsubscribe(this.channelUser.id);
    this.subscribers-=1;
  }

  videosManager(){
    this.router.navigate(["manager"],{queryParams:{id:this.channelId}})
  }


  //UI

  onMouseEnter(){
    this.hover = true;
  }

  onMouseLeave(){
    this.hover = false;
  }





  protected readonly environment = environment;
}
