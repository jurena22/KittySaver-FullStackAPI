import { Injectable } from '@angular/core';
import { BaseHttpService } from './base-http.service';
import { MessageModel } from 'src/app/models/message.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MessageHttpService extends BaseHttpService<MessageModel> {

  constructor(
    http: HttpClient
  ) {
    super(http, 'message')
   }
}
