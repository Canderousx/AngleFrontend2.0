import {Component, ElementRef, ViewChild} from '@angular/core';
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {serverResponse} from "../app.component";
import {NgIf} from "@angular/common";
import {fadeInOut} from "../../shared/animations/fadeInOut";
import {MaterialModule} from "../../shared/modules/material/material.module";
import {filter, map, tap} from "rxjs";
import {Router, RouterOutlet} from "@angular/router";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {VideoService} from "../../shared/services/video.service";
import {ToastrService} from 'ngx-toastr';
import {EngineNotificationService} from '../../shared/services/engine-notification.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  animations: [fadeInOut],
  imports: [
    NgIf,
    MaterialModule,
    MatProgressSpinner,
    RouterOutlet
  ],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {

  selectedFile?: File;
  generatedId = "";
  videoLoaded = false;
  progress = 0;
  uploading = false;
  generatingThumbnails = false;
  @ViewChild('uploadBtn', { static: false }) uploadBtn!: ElementRef<HTMLButtonElement>;

  constructor(private videoService: VideoService,
              private toastService: ToastrService,
              private notificationService: EngineNotificationService,
              private router: Router) { }

  //UI:

  thumbnailsGenerationMonitor(){
    this.notificationService.thumbnailsGenerated.subscribe({
      next: value => {
        const decodedUrl = decodeURIComponent(value.url);
        this.router.navigateByUrl(decodedUrl);
      }
    })

  }

  selectFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      if(!input.files[0].type.startsWith("video/")){
        this.toastService.info('Selected files type is not supported!')
        return;
      }
      this.selectedFile = input.files[0];
      this.uploadBtn.nativeElement.click();
    }
  }



  //ACTIONS:

  uploadVideo(event: Event) {
    event.preventDefault();
    this.generatedId = "";
    this.videoLoaded = false;
    this.thumbnailsGenerationMonitor();
    if (this.selectedFile) {
      this.uploading = true;
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.videoService.uploadVideo(formData).pipe(
          tap(event =>{
            if (event.type === HttpEventType.UploadProgress){
              if(event.total){
                this.progress = Math.round(100 * event.loaded / event.total);
              }
            }
          }),
          filter((event): event is HttpResponse<serverResponse> => event.type === HttpEventType.Response),
          map(event => event.body)
        )
        .subscribe({
        next: (response) => {
          if(response){
            this.generatedId = response.message
            this.toastService.success(response.message)
            this.uploading = false;
            this.generatingThumbnails = true;
          }
        }
        ,
        error: (error) =>{
          console.log(error);
          if(error.status !== 403){
            this.toastService.error("There was an error during the upload...")
          }
        }
      });
    }
  }





}
