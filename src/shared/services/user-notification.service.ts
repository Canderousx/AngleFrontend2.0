import { Injectable } from '@angular/core';
import {Notification} from '../models/notification';
import {BehaviorSubject, Subject} from 'rxjs';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Page} from '../models/page';
import {NotificationsService} from './notifications-service';

@Injectable({
  providedIn: 'root'
})
export class UserNotificationService {

  notifications: Notification[] = [];

  unseenNotifications = 0;

  totalNotifications = 0;

  newNotification: Subject<Notification> = new Subject();

  allNotifications = new BehaviorSubject<Notification[]>(this.notifications);

  backendUrl: string = environment.backendUrl+"/api/notifications";

  constructor(private http: HttpClient) { }


  addNotification(notification: Notification){
    this.notifications.unshift(notification);
    this.unseenNotifications++;
    this.totalNotifications++;
    console.log("UNSEEN NOTES SERVICE: "+this.unseenNotifications);
    this.allNotifications.next(this.notifications)
  }
  countUnseen(){
    let unseen = 0;
    for (let note of this.notifications){
      if(!note.seen){
        unseen ++;
      }
    }
    this.unseenNotifications = unseen;
  }
  getNotifications(page: number, pageSize: number){
    return this.http.get<Page<Notification>>(this.backendUrl+"/getNotifications?page="+page+"&pageSize="+pageSize);
  }
  setNotifications(notifications: Notification[]){
    this.notifications = notifications;
    this.countUnseen();
    this.allNotifications.next(this.notifications);
  }
  setSeen(index: number){
    this.notifications.at(index)!.seen = true;
    this.unseenNotifications--;
    this.allNotifications.next(this.notifications);
  }

  clearAll(){
    this.unseenNotifications = 0;
    this.notifications = [];
    this.allNotifications.next(this.notifications);
  }



}
