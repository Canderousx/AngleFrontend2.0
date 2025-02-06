import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from "../../shared/services/authentication.service";
import {MaterialModule} from "../../shared/modules/material/material.module";
import {AvatarChangeComponent} from "../../shared/components/avatar-change/avatar-change.component";
import {NgIf} from "@angular/common";
import {account} from "../../shared/models/account";
import {environment} from '../../environments/environment.development';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    MaterialModule,
    AvatarChangeComponent,
    NgIf
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit,OnDestroy{

  constructor(private authService: AuthenticationService,) {
  }

  user!: account;
  authSub!: Subscription;
  avatarChange = false;

  ngOnInit() {
    this.authSub = this.authService.currentUser.subscribe({
      next: user => {
        if (user) {
          this.user = user;
        }
      }
    })
  }

  ngOnDestroy() {
    if(this.authSub){
      this.authSub.unsubscribe();
    }
  }

  toggleChanger(){
    this.avatarChange = !this.avatarChange;
  }
  closeChanger(event: any){
    this.avatarChange = false;
  }


  protected readonly environment = environment;
}
