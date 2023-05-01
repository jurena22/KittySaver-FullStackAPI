import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PartnerModel } from 'src/app/models/partner.model';
import { PartnerService } from 'src/app/services/partner.service';

@Component({
  selector: 'app-get-involved',
  templateUrl: './get-involved.component.html',
  styleUrls: ['./get-involved.component.scss']
})
export class GetInvolvedComponent implements OnInit {

  
  partnerList: PartnerModel[] = [];

  constructor(
    private partnerService: PartnerService,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) { }

  ngOnInit(): void {
    this.partnerList = this.partnerService.getAll();
  }

  
  goToCats(): void {
    this.router.navigate(['cats'], {fragment: 'searchBar'});
  }

  goToAbout(): void {
    this.router.navigate(['about']);
  }

  goToJoin(elementId: string): void { 
    this.viewportScroller.scrollToAnchor(elementId);
  }

  goToLogin(): void {
    this.router.navigate(['login']);
  }
}
