import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MaterialModule} from "../../modules/material/material.module";
import {AsyncPipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {MouseEnterDirective} from "../../directives/mouse-enter.directive";
import {Router, RouterLink} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Observable, of, startWith, Subscription, switchMap} from "rxjs";
import {SearchService} from "../../services/search.service";
import {account} from "../../models/account";
import {Notification} from '../../models/notification';
import {UserNotificationService} from '../../services/user-notification.service';
import {environment} from '../../../environments/environment.development';
import {WebSocketService} from '../../services/web-socket.service';
import {SimpleDatePipe} from '../../pipes/simple-date.pipe';
import {DateFormatShortPipe} from '../../pipes/date-format-short.pipe';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MaterialModule, NgOptimizedImage, MouseEnterDirective, NgIf, RouterLink, ReactiveFormsModule, AsyncPipe, NgForOf, NgClass, DateFormatShortPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit,OnDestroy{

  constructor(private auth: AuthenticationService,
              private router: Router,
              private searchService: SearchService,
              private notificationService: UserNotificationService,
              private webSocketService: WebSocketService,
              private titleService: Title,) {
  }

  currentUser: account | null = null;
  authSub!: Subscription;
  notificationsSub!: Subscription;
  filteredOptions!: Observable<string[]>;

  unseenNotifications = 0;
  notifications: Notification[] = [];
  page = 0;
  pageSize = 10;

  search = new FormGroup({
    query: new FormControl("",Validators.required)
  })

  //LIFECYCLE HOOKS:

  ngOnInit() {
    this.filteredOptions = this.search.controls.query.valueChanges.pipe(
      startWith(''),
      switchMap(value => value ? this._filter(value) : of([]))
    );
    this.currentUserSub();
    this.notificationSub();
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
    this.notificationsSub.unsubscribe();
  }

  // SUBSCRIPTIONS:

  currentUserSub(){
    this.authSub = this.auth.currentUser.subscribe({
      next: value => {
        this.currentUser = value;
        console.log("Current user: "+this.currentUser?.username);
        console.log("ADMIN: "+this.currentUser?.admin)
      }
    })
  }

  notificationSub(){
    this.notificationsSub = this.notificationService.allNotifications.subscribe({
      next: value => {
        console.log("NEW NOTE DETECTED")
        this.notifications = value;
        this.unseenNotifications = this.notificationService.unseenNotifications;

      }
    })
  }

  markAsSeen(index: number, seen: boolean){
    if(!seen){
      this.notificationService.setSeen(index);
      this.webSocketService.sendMessage("/app/markAsSeen", {id: this.notifications.at(index)!.id});
    }
  }



  //

  refreshNotifications(){
    this.webSocketService.sendMessage("/app/getMyNotifications",{page: this.page, pageSize: this.pageSize});
  }

  clearAll(event: MouseEvent){
    event.stopPropagation();
    this.notificationService.clearAll();
    this.webSocketService.sendMessage("/app/clearAllNotifications",{});
  }

  submitSearch(){
    let q = this.search.controls.query.value;
    this.search.controls.query.reset();
    this.router.navigate(["/search"],{queryParams:{q:q}})
  }

  logout(){
    this.auth.logout();
    this.router.navigate([""]);
  }

  signin(){
    localStorage.setItem("prevURL",this.router.url);
    this.router.navigate(['signin'])
  }

  myChannel(){
    this.router.navigate(["/channel"],{queryParams: {id: this.currentUser?.id}})
  }

  adminPanel(){
    this.router.navigate(["/admin"])
  }

  private _filter(value: string): Observable<string[]> {
    return this.searchService.searchHelper(this.search.controls.query.value!);
  }

  onOptionSelected(event: any) {
    console.log(event.option.value);
    this.submitSearch();
  }

  onNotificationClick(url: string){
    const decodedUrl = decodeURIComponent(url);
    this.router.navigateByUrl(decodedUrl);
  }

  protected readonly environment = environment;
}
