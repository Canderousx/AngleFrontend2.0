import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment.development';
import {AuthenticationService} from './authentication.service';
import {ToastrService} from 'ngx-toastr';
import {serverResponse} from '../../app/app.component';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  backendUrl = environment.backendUrl+"/api/stats-service/"
  private socketClient: Stomp.Client | null = null;
  private connectionError = false;
  private connectionAttempts = 0;

  constructor(private http: HttpClient,
              private authService: AuthenticationService,
              private toast: ToastrService) { }

  connect(){
    console.log("Connect called!")
    if (this.socketClient && this.socketClient.connected){
      console.log("Connection already found. Skipping.")
      return;
    }
    const token = this.authService.getAccessToken();
    const headers = token ? {Authentication: `Bearer ${token}`} : {};
    const ws = new WebSocket(this.backendUrl.replace('http', 'ws')+"ws");
    this.socketClient = Stomp.over(ws);
    this.socketClient.debug = () => {};

    this.socketClient.connect(
      headers,
      (frame: any) => {
        if(this.connectionError){
          this.toast.success("Connection established")
        }
        this.connectionError = false;
        this.connectionAttempts = 0;
      },
      (error: any) =>{
        this.toast.warning("Lost connection with the server... Retrying.")
        this.connectionError = true;
        this.connectionAttempts++;
        if(this.connectionAttempts <= 6){
          setTimeout(
            () => this.connect(), 10000
          )
        }else {
          console.log(error)
          this.toast.error(`Connection failed after ${this.connectionAttempts} attempts. Aborting. Try refreshing the page.`)
          return;
        }
      }
    )

  }

  disconnect(): void {
    if (this.socketClient && this.socketClient.connected) {
      this.socketClient.disconnect(() => {
      });
    }
  }

  reconnect(){
    this.disconnect();
    this.connect();
  }

  sendMessage(destination: string, payload: any): void {
    if (this.socketClient && this.socketClient.connected) {
      const token = this.authService.getAccessToken();
      const headers = token ? {Authentication: `Bearer ${token}`} : {};
      this.socketClient.send(
        destination,
        headers,
        JSON.stringify(payload)
      );
    } else {
      console.error('Unable to connect with Stats Service!');
    }
  }

  onVideoPlay(videoId: string): void {
    this.sendMessage("/app/onPlay",{videoId:videoId});
  }
  onVideoPause(videoId: string){
    this.sendMessage("/app/onPause",{videoId:videoId});
  }
  onVideoEnded(videoId: string){
    this.sendMessage("/app/onEnded",{videoId:videoId});
  }

  getVideoStats(videoId: string){
    return this.http.get<{likes: number, dislikes: number}>(this.backendUrl+"watchData/videoStats?id="+videoId)
  }

  checkRate(videoId:string){
    return this.http.get<{rating: string}>(this.backendUrl+"watchData/checkRated?id="+videoId)
  }

  rateVideo(videoId: string, rate: string){
    return this.http.patch(this.backendUrl+"actions/rateVideo?v="+videoId+"&&rating="+rate,{})
  }



}
