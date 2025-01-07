import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment.development";
import {Page} from "../models/page";
import {Video} from "../models/video";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  backendUrl: string = environment.backendUrl+"/api/video-manager"

  constructor(private http: HttpClient) { }

  search(query: string,page:number,pageSize: number){
    return this.http.get<Page<Video>>(this.backendUrl+"/search?q="+query+"&&page="+page+"&&pageSize="+pageSize)
  }
  searchHelper(query: string){
    return this.http.get<string[]>(this.backendUrl+"/search/helper?q="+query);
  }


}
