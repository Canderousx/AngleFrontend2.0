import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {AuthenticationService} from "../services/authentication.service";
import {catchError, switchMap} from "rxjs";
import {GlobalMessengerService} from "../services/global-messenger.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from 'ngx-toastr';
import {serverResponse} from '../../app/app.component';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  let authService = inject(AuthenticationService);
  let global = inject(GlobalMessengerService);
  let loggedIn = !!localStorage.getItem("authToken");
  let toast = inject(ToastrService);
  let router = inject(Router)
  if(req.url.includes("signIn/refresh")){
    return next(req);
  }
  if(loggedIn) {
    const authToken = authService.getAccessToken();
    const authReq = req.clone({
      headers: req.headers.set('Authentication', `Bearer ${authToken}`)
    });
    return next(authReq).pipe(
      catchError((err: HttpErrorResponse) =>{
        if(err.status === 401){
          return authService.refreshToken().pipe(
            switchMap(() => {
              const newToken = authService.getAccessToken();
              console.log("NEW TOKEN: "+newToken);
              const newReq = req.clone({
                setHeaders: {
                  Authentication: `Bearer ${newToken}`
                }
              });
              return next(newReq)
            }),catchError(err =>{
              const message: serverResponse = err.error
              localStorage.removeItem("authToken");
              localStorage.removeItem("session");
              authService.loggedIn.next(false);
              authService.currentUser.next(null);
              router.navigate(["/signin"])
              toast.error(message.message)
              throw err;

            })
          )
        }
        throw err;
      })
    );
  }
  return next(req);
};
