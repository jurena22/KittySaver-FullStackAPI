import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { MemberModel } from 'src/app/models/member.model';

@Injectable({
  providedIn: 'root'
})
export class MemberHttpService extends BaseHttpService<MemberModel> {

  constructor(
    http: HttpClient
  ) {
    super(http, 'member')
   }
}
