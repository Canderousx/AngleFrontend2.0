import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {serverResponse} from "../../app/app.component";
import {environment} from "../../environments/environment.development";
import {Comment} from "../models/comment";
import {Page} from "../models/page";

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  backendUrl: string = environment.backendUrl+"/api/comments";

  constructor(private http: HttpClient) { }

  deleteComment(id: string) {
    return this.http.delete<serverResponse>(this.backendUrl+"/comments/delete?id="+id)
  }

  addComment(comment: Comment){
    return this.http.post<serverResponse>(this.backendUrl+"/comments/addComment",comment);
  }

  countAllComments(videoId:string){
    return this.http.get<number>(this.backendUrl+"/comments/countAllComments?videoId="+videoId);
  }

  loadComments(videoId: string, page: number, pageSize: number) {
    return this.http.get<Page<Comment>>(this.backendUrl+"/comments/getVideoComments?id="+videoId+"&page="+page+"&pageSize="+pageSize)
  }

  loadReplies(parentCommentId: string, page: number, pageSize: number) {
    return this.http.get<Page<Comment>>(this.backendUrl+"/comments/getReplies?parentCommentId="+parentCommentId+"&page="+page+"&pageSize="+pageSize)
  }

  getComment(id: string){
    return this.http.get<Comment>(this.backendUrl+"/comments/getComment?id="+id);
  }


}
