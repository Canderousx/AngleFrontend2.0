import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from "@angular/forms";
import {catchError, map, Observable, of} from "rxjs";
import {environment} from "../../environments/environment.development";
import {serverResponse} from "../../app/app.component";

@Injectable({ providedIn: 'root' })
export class UsernameValidatorService {
  constructor(private http: HttpClient) {}

  backendUrl: string = environment.backendUrl+"/api/auth/";

  usernameExists(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>{
      if (!control.value) {
        return of(null);
      }
      return this.http.get<boolean>(`${this.backendUrl}accounts/usernameExists?username=${control.value}`, {observe: "response"})
        .pipe(
          map(response =>{
            if(response.body){
              return {usernameExists: response.body}
            }
            return null;
          }),
          catchError(error => {
            console.log(error)
            return of({usernameExists: null});
          })
        )
    };
  }

  emailExists(): AsyncValidatorFn{
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      return this.http.get<boolean>(`${this.backendUrl}accounts/emailExists?email=${control.value}`,{observe: "response"})
        .pipe(
          map( response =>{
            if(response.body){
              return {emailExists: response.body}
            }
            return null;
          }),
          catchError(error =>{
            console.log(error)
            return of({emailExists:null});
          })
        )

    };
  }





}
