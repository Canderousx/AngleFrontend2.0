import { Injectable } from '@angular/core';
import {Notification} from '../models/notification';
import {Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Page} from '../models/page';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class EngineNotificationService {

  thumbnailsGenerated: Subject<Notification> = new Subject();

  videoProcessed: Subject<Notification> = new Subject();

  backendUrl: string = environment.backendUrl+"/api/notifications";

  constructor(private http: HttpClient,
              private toast: ToastrService) {
    this.videoProcessed.subscribe({
      next: value => {
        toast.success(value.title)
      }
    })
  }


  addNotification(notification: Notification){
    if(notification.title.includes("generated")){
      this.thumbnailsGenerated.next(notification);
    }
    if(notification.title.includes("processed successfully")){
      this.videoProcessed.next(notification)
    }

  }

}
