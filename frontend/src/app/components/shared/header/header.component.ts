import { Component, OnInit } from '@angular/core';
import { NavDataModel } from 'src/app/models/navData.model';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  
  constructor() { }

  ngOnInit(): void {
    
  }

}
