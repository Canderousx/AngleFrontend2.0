import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {environment} from "../../environments/environment.development";
import {serverResponse} from "../../app/app.component";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class SubscribeService {

  constructor(private http: HttpClient,
              private router: Router) {
  }

  subscribed: Subject<boolean> = new Subject();
  backendUrl: string = environment.backendUrl+"/api/auth/accounts";

  isSubscriber(id: string){
    return this.http.get<boolean>(this.backendUrl+"/isSubscriber?id="+id)
  }


  subscribe(id: string){
    this.http.post<serverResponse>(this.backendUrl+"/subscribe?channelId="+id,{})
      .subscribe({
        next: value => {
          this.subscribed.next(true);
        },
        error: err => {
          this.router.navigate(["signin"])
        }
      })

  }

  unsubscribe(id: string){
    this.http.post<serverResponse>(this.backendUrl+"/unsubscribe?channelId="+id,{})
      .subscribe({
        next: value => {
          this.subscribed.next(false);
        }
      })
  }

  countSubscribers(id: string){
    return this.http.get<number>(this.backendUrl+"/countSubscribers?id="+id)
  }


}
