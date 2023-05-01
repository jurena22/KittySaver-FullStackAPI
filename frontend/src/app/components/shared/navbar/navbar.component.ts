import { Component, OnInit } from '@angular/core';
import { MemberModel } from 'src/app/models/member.model';
import { NavDataModel } from 'src/app/models/navData.model';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  navLinkArray: NavDataModel[] = [];

  user!: MemberModel | null;

  constructor(
    private navService: NavigationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.navLinkArray = this.navService.navLinks;

    this.authService.userObject.subscribe((u)=>{
      this.user = u;
    })
  }


}
