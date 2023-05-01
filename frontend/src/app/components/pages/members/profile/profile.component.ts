import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MemberModel } from 'src/app/models/member.model';
import { AuthService } from 'src/app/services/auth.service';
import { MemberHttpService } from 'src/app/services/baseHttp/member-http.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  @Input() userId?: string;
  user?: MemberModel | null;

  constructor(
    private memberService: MemberHttpService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if(this.userId){
      this.memberService.findById(this.userId).subscribe(
        (user: MemberModel) => this.user = user
      )
    }

  }

  updateProfile(){
    this.router.navigate(['editProfile', this.userId]);
  }

  logout(){
    this.authService.logout().subscribe();
    this.router.navigate(['']);
  }

}
