import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Subject, switchMap, tap} from "rxjs";
import {environment} from "../../environments/environment.development";
import {serverResponse} from "../../app/app.component";
import {authRes} from "../../app/sign-in/sign-in.component";
import {account} from "../models/account";
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';
import {NotificationsService} from './notifications-service';
import {StatsService} from './stats.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  loggedUser: account | null = null;
  currentUser: BehaviorSubject<account | null> = new BehaviorSubject(this.loggedUser)
  backendUrl: string = environment.backendUrl+"/api/auth";

  constructor(private http: HttpClient,
              private toast: ToastrService,
              private router: Router) {

  }

  getAccessToken(){
    return localStorage.getItem("authToken");
  }

  authenticate(credentials: {email: string, password: string}){
    return this.http.post<authRes>(this.backendUrl+"/signIn",credentials).pipe(
      tap(value => {
        localStorage.setItem("authToken",value.authToken)
        localStorage.setItem("session",value.session)
      }),
      switchMap( () =>{
        return this.getCurrentUser();
      })
    )
  }

  clearSessionData(){
    localStorage.removeItem("authToken");
    localStorage.removeItem("session");
    this.loggedUser = null;
    this.currentUser.next(null);
  }

  logout(){
    const refreshToken = localStorage.getItem("session");
    this.http.post<serverResponse>(`${this.backendUrl}/signIn/logout`, {refreshToken: refreshToken}).subscribe({
      next: value => {
        this.clearSessionData();
        this.toast.info(value.message)
      }
    })
  }

  accountBannedEvent(){
    this.clearSessionData();
    this.toast.error("You've been banned. Check your email for more details.")
    this.router.navigate(["/"])
  }



  getCurrentUser(){
    return this.http.get<account>(this.backendUrl+"/accounts/getCurrentUser").pipe(
      tap(user => {
        this.loggedUser = user;
        this.currentUser.next(this.loggedUser)
      })
    )
  }

  signup(account: any){
    return this.http.post<serverResponse>(this.backendUrl+"/signUp",account)
  }

  getUser(id: string){
    if(this.loggedUser && this.loggedUser.id == id){
      return this.currentUser;
    }
    return this.http.get<account>(this.backendUrl+"/accounts/getUserById?id="+id)
  }

  restorePassword(password: string,token: string){
    return this.http.post<serverResponse>(this.backendUrl+"/signUp/passwordRecovery",{password: password,token: token})
  }


  passwordRecovery(email: string){
    return this.http.post<serverResponse>(this.backendUrl+"/signUp/recoverPassword",{email: email})
  }

  refreshToken(){
    const refreshToken = localStorage.getItem("session")
    return this.http.post(this.backendUrl+"/signIn/refresh",{refreshToken: refreshToken},{responseType: 'text'})
      .pipe(
        tap(res=>{
          localStorage.setItem("authToken",res);
        })
      )
  }
}
