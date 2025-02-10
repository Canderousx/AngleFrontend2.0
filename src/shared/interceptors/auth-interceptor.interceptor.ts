import {HttpErrorResponse, HttpEvent, HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {AuthenticationService} from "../services/authentication.service";
import {catchError, Observable, switchMap, tap, throwError} from "rxjs";
import {Router} from "@angular/router";
import {ToastrService} from 'ngx-toastr';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  let authService = inject(AuthenticationService);
  let loggedIn = !!localStorage.getItem("session");
  let toast = inject(ToastrService);
  let router = inject(Router)
  if(req.url.includes("signIn/refresh")){
    return next(req);
  }
  if (loggedIn) {
    const authToken = authService.getAccessToken();

    const handleRefreshOrLogout = (): Observable<HttpEvent<any>> => {
      return authService.refreshToken().pipe(
        switchMap(() => {
          const newToken = authService.getAccessToken();
          if (newToken) {
            const newReq = req.clone({
              setHeaders: { Authentication: `Bearer ${newToken}` }
            });
            return next(newReq);
          } else {
            router.navigate(['/signin']);
            toast.error('Session timeout. You need to sign in to your account.');
            return throwError(() => new Error('Unauthorized refresh attempt'));
          }
        }),
      );
    };
    if (authToken) {
      const authReq = req.clone({
        setHeaders: { Authentication: `Bearer ${authToken}` }
      });
      return next(authReq).pipe(
        catchError((err: HttpErrorResponse) => {
          console.log(err);
          if (err.status === 401) {
            return handleRefreshOrLogout();
          }
          return throwError(() => err);
        })
      );
    }
    else {
      return handleRefreshOrLogout();
    }

  }
  return next(req);
};
