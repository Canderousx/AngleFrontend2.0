import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {ReportService} from "../../shared/services/report.service";
import {AuthenticationService} from "../../shared/services/authentication.service";
import {Subscription} from 'rxjs';
import {account} from '../../shared/models/account';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit{

  constructor(private router: Router,
              private authenticationService: AuthenticationService,) {
  }
  currentUser: account | null = null;
  authSub!: Subscription;


  ngOnInit() {
    this.authSubscription();

  }

  //SUBS:
  authSubscription(){
    this.authSub = this.authenticationService.currentUser.subscribe({
      next: user => {
        this.currentUser = user;
        this.checkIfAuthorized();
      }
    })

  }
  //


  checkIfAuthorized(){
    if(!this.currentUser || !this.currentUser.admin){
      this.router.navigate(["pageNotFound"])
    }else{
      this.router.navigate(['admin/summary'])
    }
  }


}
