import { Component, OnInit } from '@angular/core';
import { NavDataModel } from 'src/app/models/navData.model';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  currentYear = new Date().getFullYear();

  links!: NavDataModel[];

  constructor(
    private navService: NavigationService
  ) { }


  ngOnInit(): void {
    this.links = this.navService.navLinks;
  }

}
