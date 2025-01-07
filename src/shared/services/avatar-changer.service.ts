import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {serverResponse} from "../../app/app.component";
import {environment} from "../../environments/environment.development";

@Injectable({
  providedIn: 'root'
})
export class AvatarChangerService {

  backendUrl: string = environment.backendUrl+"/api/auth";

  constructor(private http: HttpClient) { }

  changeAvatar(formData: FormData){
    return this.http.post<serverResponse>(this.backendUrl+"/accounts/setAvatar",formData)
  }
}
