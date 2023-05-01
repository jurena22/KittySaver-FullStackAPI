import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { CatModel } from 'src/app/models/cat.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CatHttpService extends BaseHttpService<CatModel> {

  constructor(
    http: HttpClient
    ) {
      super(http, 'cat')
     }
}
