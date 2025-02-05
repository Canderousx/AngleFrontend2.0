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
import {WebSocketService} from '../shared/services/web-socket.service';
import {UserNotificationService} from '../shared/services/user-notification.service';
import {StatsService} from '../shared/services/stats.service';


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
  constructor(private webSocketService: WebSocketService,
              private statsService: StatsService,
              private auth: AuthenticationService,
              private notificationService: UserNotificationService) {
  }
  title = 'Angle - Between the Thoughts!';
  currentUser: account | null = null;
  alert: string[] = [];

  // LIFECYCLE HOOKS:

  ngOnInit() {
    this.auth.currentUser.subscribe({
      next: value => {
        this.currentUser = value;
        if(value){
          this.webSocketService.connect();
          this.getNotifications();
        }
        this.statsService.connect();
      }
    })
    if(localStorage.getItem("authToken")){
      this.auth.getCurrentUser().subscribe({
        next: value => {
          this.auth.currentUser.next(value);
          this.auth.loggedIn.next(true)
        }
      })
    }

  }

  ngOnDestroy() {
    this.webSocketService.disconnect();
    this.statsService.disconnect();

  }

  //DOWNLOADING DATA FROM API:

  getNotifications(){
    this.notificationService.getNotifications(0,10).subscribe({
      next: value => {
        this.notificationService.setNotifications(value.content)
      }
    })
  }

}
