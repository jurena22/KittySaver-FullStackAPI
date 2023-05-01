import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MemberModel } from 'src/app/models/member.model';
import { MessageModel } from 'src/app/models/message.model';
import { AuthService } from 'src/app/services/auth.service';
import { MessageHttpService } from 'src/app/services/baseHttp/message-http.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit {

  messages: MessageModel[] = [];
  user?: MemberModel | null;

  constructor(
    private authService: AuthService,
    private messageService: MessageHttpService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.authService.userObject.subscribe((u)=>{
      this.user = u;
    });
    
    if(this.user?.role === 'ADMIN'){
      this.loadData();
    }
      
  }

  openMessage(message: MessageModel){
    if(this.user?.role === 'ADMIN' && !message.opened){
      this.messageService.update(message._id!, message).subscribe({
        next: (savedMessage)=>{
          this.toastr.success('You have read the message.', 'Done!')
          this.loadData();
        }
      });
    }
 
  }

  loadData(){
    this.messageService.findAll().subscribe({next: (messages: MessageModel[]) => {
      this.messages = messages.filter(m => m.sender && (this.getSender(m.sender) !== this.user?.name))
    }
    });
    
  }

  getSender(sender: string | {_id: string, name: string}){
    return typeof sender === 'string' ? sender : sender.name;
  }


}
