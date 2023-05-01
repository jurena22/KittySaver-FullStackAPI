import { Component, OnInit } from '@angular/core';
import { MemberModel } from 'src/app/models/member.model';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss']
})
export class MembersComponent implements OnInit {

  user!: MemberModel | null;
  userId?: string;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {

    this.authService.userObject.subscribe((u)=>{
      this.user = u;
      if(u){
        this.userId = u._id;
      }
    })
  }

}
