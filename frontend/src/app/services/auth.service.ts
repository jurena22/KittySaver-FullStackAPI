import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MemberModel } from '../models/member.model';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  BASE_URL = environment.apiUrl;

  private _userObject = new BehaviorSubject<MemberModel | null>(null);

  constructor(private http: HttpClient) { }

  login(userLog: any): Observable<{accessToken: string, refreshToken: string, user: MemberModel}>{
    return this.http.post<{accessToken: string, refreshToken: string, user: MemberModel}>(`${this.BASE_URL}login`, userLog).pipe(tap(loginData => {
      if(loginData.accessToken && loginData.refreshToken){
        localStorage.setItem('accessToken', loginData.accessToken);
        localStorage.setItem('refreshToken', loginData.refreshToken);
      }
      this._userObject.next(loginData.user)
    }))
  }

  refresh(): Observable<{accessToken: string}>{
    const refreshToken = localStorage.getItem('refreshToken');
 
    return this.http.post<{accessToken: string}>(`${this.BASE_URL}refresh`, {refreshToken}).pipe(tap(tokenData => {
      if(tokenData && tokenData.accessToken){
        localStorage.setItem('accessToken', tokenData.accessToken);
      }
    })) 
  }

  logout(){
    const refreshToken = localStorage.getItem('refreshToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('accessToken');

    this._userObject.next(null);
    
    return this.http.post(`${this.BASE_URL}logout`, {refreshToken})
  }

  get userObject(): BehaviorSubject<MemberModel | null> {
    return this._userObject;
  }
}
