import {Component, HostListener, OnInit} from '@angular/core';
import {GlobalMessengerService} from "../../shared/services/global-messenger.service";
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {FeedComponent} from "../../shared/components/feed/feed.component";
import {MatDivider} from "@angular/material/divider";
import {Title} from "@angular/platform-browser";
import {VideoService} from "../../shared/services/video.service";
import {Video} from "../../shared/models/video";
import {AuthenticationService} from "../../shared/services/authentication.service";
import {account} from "../../shared/models/account";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgIf,
    FeedComponent,
    MatDivider
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  constructor(private videoService: VideoService,
              private global: GlobalMessengerService,
              private titleService: Title,
              private authService: AuthenticationService) {
  }

  latestVideos: Video[] = [];
  mostPopular: Video[] = [];
  loaded = false;
  fromSubsVideos: Video[] = [];
  pageNum = 0;
  pageSize = 10;
  totalPages = 0;
  subPageNum = 0;
  currentUser: account | null = null;

  //LIFECYCLE HOOKS:

  ngOnInit() {
    this.authService.currentUser.subscribe({
      next: value => {
        this.currentUser = value;
        if(this.currentUser){
          this.videoService.getBySubscribed(this.subPageNum,this.pageSize).subscribe({
            next: value => {
              this.fromSubsVideos = value.content;
            }
          })
        }
      }
    })
    this.loaded = false;
    this.titleService.setTitle("Angle - Between the Thoughts!")
    this.videoService.getMostPopular(6).subscribe({
      next: value => {
        this.mostPopular = value;
      }
    })
    this.loadLatest();

  }

  //DOWNLOADING DATA FROM API:

  loadLatest(){
    if(this.totalPages === 0 || this.totalPages >= this.pageNum){
      this.videoService.getLatestVideos(this.pageNum,this.pageSize).subscribe({
        next: value => {
          this.latestVideos = this.latestVideos.concat(value.content);
          this.totalPages = value.totalPages;
          console.log("Videos received: "+this.latestVideos.length)
          this.loaded = true;
        },
        error: err => {
          console.log(err.error)
          this.global.toastMessage.next(["alert-warning","Internal Server Error. Please try again later"])
        }
      })
    }else{
      this.pageNum = this.totalPages;
    }
  }


  //UI
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      this.pageNum+=1;
      this.loadLatest();
    }
  }


}
