import {
  AfterViewInit,
  Component,
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
export class VideoPlayerComponent implements AfterViewInit, OnChanges{

  constructor() {


  }
  @Input()videoUrl!: string;
  showPlayer = true;
  api: VgApiService = new VgApiService();
  qualities: BitrateOptions[] = [];
  @ViewChild('media') media: any;

  // LIFECYCLE HOOKS:

  ngAfterViewInit() {
    this.setBitrates();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes['videoUrl'] && !changes['videoUrl'].isFirstChange()){
      this.setBitrates();
      this.reloadPlayer();
    }

  }

  //ACTIONS:
  onVolumeChange(event: any) {
    localStorage.setItem("volume",this.api.volume);
  }



  //UI:

  onPlayerReady(source: VgApiService){
    this.api = source;
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
