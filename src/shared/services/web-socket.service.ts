import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import { environment } from '../../environments/environment.development';
import {Notification} from '../models/notification';
import {UserNotificationService} from './user-notification.service';
import {EngineNotificationService} from './engine-notification.service';
import {Page} from '../models/page';
import {AuthenticationService} from './authentication.service';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private backendUrl = environment.backendUrl + '/api/notifications/ws';
  private socketClient: Stomp.Client | null = null;
  private connectionError = false;
  private connectionAttempts = 0;

  constructor(private userNotification: UserNotificationService,
              private engineNotification: EngineNotificationService,
              private authService: AuthenticationService,
              private toast: ToastrService) {}


  connect(): void {
    if (this.socketClient && this.socketClient.connected) {
      this.disconnect();
    }
    const token = localStorage.getItem('authToken');
    if (token) {
      const ws = new WebSocket(this.backendUrl.replace('http', 'ws'));

      this.socketClient = Stomp.over(ws);
      this.socketClient.debug = () => {};

      this.socketClient.connect(
        { Authentication: 'Bearer ' + token },
        (frame: any) => {
          this.socketClient?.subscribe(`/user/queue/notification`, (message) => {
            this.handleNotification(JSON.parse(message.body));
          });
          this.socketClient?.subscribe('/user/queue/myNotifications',(message: Stomp.Message) =>{
            this.handleAllNotifications(JSON.parse(message.body));
            }
          )
          this.socketClient?.subscribe('/user/queue/accountBanned',(message: Stomp.Message) =>{
              this.handleAccountBanned();
            }
          )
          if(this.connectionError){
            this.connectionError = false;
            this.toast.success("Connection established.")
            this.connectionAttempts = 0;
          }

        },
        (error: any) => {
          this.toast.warning("Lost connection with the server... Retrying.")
          this.connectionError = true;
          this.connectionAttempts++;
          if(this.connectionAttempts <= 2){
            setTimeout(
              () => window.location.reload(), 10000
            )
          }else{
            setTimeout(
              () =>
                this.connect(),
              10000
            )
          }
        }
      );
    }
  }

  disconnect(): void {
    if (this.socketClient) {
      this.socketClient.disconnect(() => {
        console.log('Disconnected from WebSocket');
      });
    }
  }

  sendMessage(destination: string, payload: any): void {
    if (this.socketClient && this.socketClient.connected) {
      this.socketClient.send(
        destination,
        {
          Authentication: `Bearer ${localStorage.getItem('authToken')}`,
        },
        JSON.stringify(payload)
      );
    } else {
      console.error('Unable to connect with Notification Service!');
    }
  }

  private handleAccountBanned(){
    this.authService.accountBannedEvent();
  }

  private handleNotification(notification: Notification): void {
    if(notification.forUser){
      this.userNotification.addNotification(notification);
    }else{
      this.engineNotification.addNotification(notification);
    }
  }

  private handleAllNotifications(notificationsPage: Page<Notification>): void {
        this.userNotification.setNotifications(notificationsPage.content);
  }
}
