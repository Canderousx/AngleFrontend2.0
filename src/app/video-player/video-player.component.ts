import {
  AfterViewInit,
  Component, HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {NgIf} from "@angular/common";
import {VgControlsModule} from "@videogular/ngx-videogular/controls";
import {BitrateOptions, VgApiService, VgCoreModule} from "@videogular/ngx-videogular/core";
import {VgOverlayPlayModule} from "@videogular/ngx-videogular/overlay-play";
import {VgBufferingModule} from "@videogular/ngx-videogular/buffering";
import {VgStreamingModule} from "@videogular/ngx-videogular/streaming";
import {MaterialModule} from "../../shared/modules/material/material.module";
import {environment} from '../../environments/environment.development';
import {StatsService} from '../../shared/services/stats.service';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [
    NgIf,
    VgControlsModule,
    VgCoreModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgStreamingModule,
    MaterialModule
  ],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css'
})
export class VideoPlayerComponent implements OnInit, AfterViewInit, OnChanges,OnDestroy{

  constructor(private statsService: StatsService) {


  }
  @Input()videoUrl!: string;
  @Input()videoId!: string;
  prevVideoId!: string;
  @ViewChild('media') media: any;
  showPlayer = true;
  api: VgApiService = new VgApiService();
  qualities: BitrateOptions[] = [];

  onPlay!: Subscription;
  onPause!: Subscription;
  onEnded!: Subscription;

  // LIFECYCLE HOOKS:

  ngOnInit() {
    this.prevVideoId = this.videoId;
  }

  ngAfterViewInit() {
    this.setBitrates();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['videoUrl'] && !changes['videoUrl'].isFirstChange()){
      this.statsService.onVideoEnded(this.prevVideoId)
      this.setBitrates();
      this.reloadPlayer();
    }
  }

  ngOnDestroy() {
    if(this.onPlay){
      this.onPlay.unsubscribe();
    }
    if(this.onPause){
      this.onPause.unsubscribe();
    }
    if(this.onEnded){
      this.onEnded.unsubscribe();
    }
    this.statsService.onVideoEnded(this.prevVideoId)
  }

  // SUBSCRIPTIONS:

  onPlaySub(){
    this.onPlay = this.api.getDefaultMedia().subscriptions.play.subscribe({
      next: value => {
        this.statsService.onVideoPlay(this.prevVideoId)
      }
    })
  }
  onPauseSub(){
    this.onPause = this.api.getDefaultMedia().subscriptions.pause.subscribe({
      next: value => {
        this.statsService.onVideoPause(this.prevVideoId)
      }
    })
  }
  onEndedSub(){
    this.onEnded = this.api.getDefaultMedia().subscriptions.ended.subscribe({
      next: value => {
        this.statsService.onVideoEnded(this.prevVideoId)
      }
    })
  }

  //ACTIONS:
  onVolumeChange(event: any) {
    localStorage.setItem("volume",this.api.volume);
  }


  // @HostListener('window:beforeunload', ['$event'])
  // onBeforeUnload(event: BeforeUnloadEvent) {
  //   localStorage.setItem("videoUrl", this.videoId);
  //   localStorage.setItem("time",this.watchTime.toString());
  // }


  //DATA TO API:



  //UI:

  onPlayerReady(source: VgApiService){
    this.api = source;
    this.onPlaySub();
    this.onPauseSub();
    this.onEndedSub();
    this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(
      this.autoplay.bind(this)
    )
    if(localStorage.getItem("volume")){
      this.api.volume = +localStorage.getItem("volume")!;
    }
    this.api.getDefaultMedia().subscriptions.volumeChange.subscribe(
      this.onVolumeChange.bind(this)
    );
  }

  reloadPlayer(){
    this.showPlayer = false;
    this.prevVideoId = this.videoId;
    setTimeout(() => {
      this.showPlayer = true;
    }, 50);
  }

  autoplay(){
    console.log("play")
    this.api.play();
    this.setBitrates();
  }

  setBitrates(){
    if(this.qualities.length === 0){
      console.log("Error: Couldn't set Bitrates!")
      return
    }
    for(let bitrate of this.qualities){
      switch (bitrate.label){
        case "1681":
          bitrate.label = "480p";
          break;
        case "3291":
          bitrate.label = "720p";
          break;
        case "5711":
          bitrate.label = "1080p";
          break;
      }
    }
  }






  protected readonly environment = environment;
}
