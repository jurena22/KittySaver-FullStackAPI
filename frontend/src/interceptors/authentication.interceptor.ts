import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "src/app/services/auth.service";

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService
    ){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        const token = localStorage.getItem('accessToken');
        let request = req;

        if(token){
            request = req.clone({
                headers: req.headers.set('authorization', `Bearer ${token}`)    
            })
        }

        return next.handle(request)
        .pipe(catchError(err => {
            if(err.status === 401){
                return throwError(()=> new Error('You have to be logged in!'))
            }else if(err.status === 403){
                return this.handle403Error(request, next)
            }
            return throwError(()=> new Error('Oops something happened - we do not know what'))
        }));

    }

    handle403Error(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return this.authService.refresh().pipe(
            switchMap((tokenData)=>{
                const newRequest = req.clone({
                    headers: req.headers.set('authorization', `Bearer ${tokenData.accessToken}`)
                })
                return next.handle(newRequest);
            })
        )
    }

}