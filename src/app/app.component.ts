import {Component, OnDestroy, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from "../shared/components/header/header.component";
import {FooterComponent} from "../shared/components/footer/footer.component";
import {AlertComponent} from "../shared/components/alert/alert.component";
import {NgIf} from "@angular/common";
import {fadeInOut} from "../shared/animations/fadeInOut";
import {AuthenticationService} from "../shared/services/authentication.service";
import {ModalComponent} from "../shared/components/modal/modal.component";
import {account} from "../shared/models/account";
import {NotificationsService} from '../shared/services/notifications-service';
import {UserNotificationService} from '../shared/services/user-notification.service';
import {StatsService} from '../shared/services/stats.service';
import {Subscription} from 'rxjs';


export interface serverResponse{
  message: string;
}
@Component({
  selector: 'app-root',
  standalone: true,
  animations: [fadeInOut],
  imports: [RouterOutlet, HeaderComponent, FooterComponent, AlertComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy{
  constructor(private auth: AuthenticationService,
              private userNotificationService: UserNotificationService,
              private notificationsService: NotificationsService,
              private statsService: StatsService,) {
  }
  title = 'Angle - Between the Thoughts!';
  currentUser: account | null = null;
  authSub!: Subscription;
  alert: string[] = [];
  logoutEventSub!: Subscription;

  // LIFECYCLE HOOKS:

  ngOnInit() {
    this.authServiceSub();
    if(localStorage.getItem("authToken")){
      this.auth.getCurrentUser().subscribe();
    }

  }

  ngOnDestroy() {
    if(this.currentUser){
      this.notificationsService.disconnect();
      this.statsService.disconnect();
    }
    if(this.authSub){
      this.authSub.unsubscribe();
    }
  }

  //SUBSCRIPTIONS:
  authServiceSub(){
    this.authSub = this.auth.currentUser.subscribe({
      next: value => {
        this.statsService.reconnect();
        if(value){
          this.currentUser = value;
          this.notificationsService.connect();
          this.getNotifications();
        }else{
          this.notificationsService.disconnect();
        }
      }
    })
  }

  //DOWNLOADING DATA FROM API:

  getNotifications(){
    this.userNotificationService.getNotifications(0,10).subscribe();
  }


}
