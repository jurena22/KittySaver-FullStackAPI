import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseHttpService<T> {

  BASE_URL = environment.apiUrl

  constructor(
    private http: HttpClient,
    protected entity: String
  ) { 
    this.BASE_URL += entity;
  }



  create(entityObj: T): Observable<T>{
    return this.http.post<T>(`${this.BASE_URL}`, entityObj)
  }

  findById(id: string): Observable<T>{
    
    return this.http.get<T>(`${this.BASE_URL}/${id}`);
  }

  findAll(): Observable<T[]>{
    return this.http.get<T[]>(`${this.BASE_URL}`);
  }

  update(id: string, entityObj: T): Observable<T> {
  
    return this.http.put<T>(`${this.BASE_URL}/${id}`, entityObj)
  }

  delete(id: string): Observable<T>{
  
    return this.http.delete<T>(`${this.BASE_URL}/${id}`)
  }
}
