import {Component, OnDestroy, OnInit,} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FeedComponent} from "../../shared/components/feed/feed.component";
import {NgForOf} from "@angular/common";
import {SimpleDatePipe} from "../../shared/pipes/simple-date.pipe";
import {MouseEnterDirective} from "../../shared/directives/mouse-enter.directive";
import {SearchService} from "../../shared/services/search.service";
import {VideoService} from "../../shared/services/video.service";
import {Video} from "../../shared/models/video";
import {environment} from '../../environments/environment.development';
import {Subscription} from 'rxjs';
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    FeedComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit,OnDestroy{

  constructor(private searchService: SearchService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private videoService: VideoService,) {

  }

  query!: string;
  page = 0;
  pageSize = 10;
  totalVideos = 0;
  results!: Video[];
  querySub!: Subscription;

  //LIFECYCLE HOOKS:
  ngOnInit() {
    this.querySub = this.activatedRoute.queryParams.subscribe({
      next: value => {
        if(value['q']){
          this.query = value['q'];
          this.results = [];
          this.search();
        }
      }
    })

  }

  ngOnDestroy() {
    if (this.querySub) {
      this.querySub.unsubscribe();
    }
  }

  //DOWNLOADING DATA FROM API:

  search(){
    if(this.query){
      this.searchService.search(this.query,this.page,this.pageSize).subscribe({
          next: value => {
            this.results = value.content;
            this.totalVideos = value.totalElements;
          }
        })
    }
  }

  //ACTIONS:
  watch(id: string){
    this.router.navigate(["/watch"],{queryParams: {v: id}})
  }


  protected readonly environment = environment;
}
