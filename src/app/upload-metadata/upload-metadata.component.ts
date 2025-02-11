import {Component,OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {GlobalMessengerService} from "../../shared/services/global-messenger.service";
import {Subscription} from "rxjs";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MaterialModule} from "../../shared/modules/material/material.module";
import {MatInput} from "@angular/material/input";
import {serverResponse} from "../app.component";
import {VideoService} from "../../shared/services/video.service";
import {environment} from '../../environments/environment.development';
import {ToastrService} from 'ngx-toastr';


export interface tag{
  name: string
}
@Component({
  selector: 'app-upload-metadata',
  standalone: true,
  imports: [
    NgIf,
    MatProgressSpinner,
    NgForOf,
    ReactiveFormsModule,
    MaterialModule,
    MatInput,
    NgClass,
    MaterialModule
  ],
  templateUrl: './upload-metadata.component.html',
  styleUrl: './upload-metadata.component.css'
})
export class UploadMetadataComponent implements OnInit, OnDestroy{

  constructor(private activatedRoute: ActivatedRoute,
              private videoService: VideoService,
              private router: Router,
              private toast: ToastrService) {
  }

  videoId!: string;
  sub!: Subscription;
  index = 0;
  thumbnails: string[] = [];
  existingVideo = false;
  banned = false;

  metaName = new FormGroup({
    name: new FormControl("",{validators: Validators.required})
  })
  metaDesc = new FormGroup({
    description: new FormControl("",{validators: Validators.required})
  })
  metaTags = new FormGroup({
    tags: new FormControl("",{validators: Validators.required})
  })
  metaThumbnail = new FormGroup({
    thumbnail: new FormControl("",{validators: Validators.required})
  })

  // LIFECYCLE HOOKS:

  ngOnInit() {
    this.sub = this.activatedRoute.queryParams.subscribe({
      next: value => {
        this.videoId = value['v'];
        console.log("Video ID: "+this.videoId);
        if(value['existing']){
          this.existingVideo = true;
          this.setExistingVideo();
        }
        this.getThumbnails();
      }
    })

  }

  ngOnDestroy() {
    if(this.sub){
      this.sub.unsubscribe();
    }
  }



  //DOWNLOADING DATA FROM API:

  setExistingVideo(){
    this.videoService.setExistingVideo(this.videoId).subscribe({
      next: value => {
        this.metaName.controls.name.setValue(value.name);
        this.metaDesc.controls.description.setValue(value.description);
        let tags = "";
        this.metaTags.controls.tags.setValue(tags);
      },
      error: err => {
        if(err.status === 666){
          this.banned = true;
        }
      }
    })
  }

  getThumbnails(){
    this.videoService.getThumbnails(this.videoId)
      .subscribe({
        next: value => {
          value.forEach(val => {
            this.thumbnails.push(val)
          })
        },
        error: (err : HttpErrorResponse) => {
          if(err.status === 400){
            this.router.navigate([""])
          }else{
            this.toast.error('An error occured during video processing....')
          }
        }
      })

  }

  //ACTIONS:

  submit(){
    let tagsNames = this.metaTags.controls.tags.value?.split(",");
    let tags: tag[] = [];
    tagsNames!.forEach(tag =>{
      if(tag.length > 0){
        tags.push({name: tag.trim()})
      }
    })
    let video = {
      name: this.metaName.controls.name.value!,
      description: this.metaDesc.controls.description.value!,
      tags: tags!,
      thumbnail: this.metaThumbnail.controls.thumbnail.value!
    }
    this.videoService.setMetadata(this.videoId,video).subscribe({
      next: value => {
        this.toast.success('Metadata has been saved!')
        this.router.navigate([''])
      },
      error: err => {
        let sR: serverResponse = err.error;
        this.toast.error(sR.message)
      }
    })
  }

  //UI:

  selectThumbnail(content: string){
    this.metaThumbnail.controls.thumbnail.setValue(content);
  }














  protected readonly environment = environment;
}
