import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {serverResponse} from "../../app/app.component";
import {Page} from "../models/page";
import {Video} from "../models/video";
import {AuthenticationService} from "./authentication.service";

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  backendUrl = environment.backendUrl+"/api/video-manager"

  constructor(private http: HttpClient,private authService: AuthenticationService) { }

  getVideo(videoId: string){
    return this.http.get<Video>(this.backendUrl+"/videos/getVideo?id="+videoId)
  }

  getAuthor(authorId: string){
    return this.authService.getUser(authorId)
  }

  registerView(videoId: string){
    return this.http.patch<serverResponse>(this.backendUrl+"/manage/registerView?id="+videoId,{})
  }

  rateVideo(videoId: string, rate: string){
    return this.http.patch(this.backendUrl+"/manage/rateVideo?v="+videoId+"&&rating="+rate,{})
  }

  getUserVideos(channelId: string,page: number, pageSize: number) {
    return this.http.get<Page<Video>>(this.backendUrl+"/videos/getUserVideos?id="+channelId+"&&page="+page+"&&pageSize="+pageSize)
  }

  getCurrentUserVideos(page: number, pageSize: number){
    return this.http.get<Page<Video>>(this.backendUrl+"/videos/getCurrentUserVideos?page="+page+"&&pageSize="+pageSize)
  }

  getLatestVideos(page: number,pageSize: number){
    return this.http.get<Page<Video>>(this.backendUrl+"/videos/getLatestVideos?page="+page+"&&pageSize="+pageSize)
  }

  getMostPopular(quantity: number){
    return this.http.get<Video[]>(this.backendUrl+`/videos/getMostPopular?quantity=${quantity}`)
  }

  getBySubscribed(page:number, pageSize:number){
    return this.http.get<Page<Video>>(this.backendUrl+"/videos/getBySubscribed?page="+page+"&&pageSize="+pageSize)
  }

  getSimilarVideos(videoId: string){
    return this.http.get<Video[]>(this.backendUrl+"/videos/getSimilar?id="+videoId)
  }

  uploadVideo(formData: FormData){
    return this.http.post<serverResponse>(this.backendUrl+"/upload", formData,{observe: 'events', reportProgress: true})
  }

  getThumbnails(videoId:string){
    return this.http.get<string[]>(this.backendUrl+"/upload/getThumbnails?v="+videoId);
  }

  setMetadata(videoId: string, video: any){
    return this.http.post<serverResponse>(this.backendUrl+"/upload/setMetadata?id="+videoId,video)
  }

  setExistingVideo(videoId:string){
    return this.getVideo(videoId);
  }

  deleteVideo(videoId:string){
    return this.http.delete<serverResponse>(this.backendUrl+"/manage/deleteVideo?videoId="+videoId)
  }

  getLikesNDislikes(videoId: string){
    return this.http.get<{likes: number, dislikes: number}>(this.backendUrl+"/videos/getLikesNDislikes?id="+videoId)
  }

  checkRate(videoId:string){
    return this.http.get<{rating: string}>(this.backendUrl+"/videos/checkRated?v="+videoId)
  }
}
