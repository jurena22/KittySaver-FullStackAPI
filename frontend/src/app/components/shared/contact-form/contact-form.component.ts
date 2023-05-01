import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MemberModel } from 'src/app/models/member.model';
import { MessageModel } from 'src/app/models/message.model';
import { AuthService } from 'src/app/services/auth.service';
import { MessageHttpService } from 'src/app/services/baseHttp/message-http.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit {

  user!: MemberModel | null;

  newMessage = {
    messageText: '',
    rules: false,
}
  

  constructor(
   private messageService: MessageHttpService,
   private authService: AuthService,
   private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.authService.userObject.subscribe((u)=>{
      this.user = u;
    })
 
  }

  saveMessage (messageForm: NgForm): void {
    if (messageForm.valid) {
      const messageData: MessageModel = {
        sender: this.user!._id!,
        messageText: messageForm.value.messageText,
        opened: false
      }
      
      this.messageService.create(messageData).subscribe({
        next: (savedMessage)=>{
          messageForm.reset();
          this.toastr.success('We will contact you soon. Thank you!', 'Message sent to admin.');
         
        },
        error: (err) => {
          this.toastr.error('Try it later please.', 'Oops!');
        }
      })
      
    }
  }

}
