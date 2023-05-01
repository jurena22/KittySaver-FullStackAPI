import { Component, OnInit } from '@angular/core';
import { PartnerModel } from 'src/app/models/partner.model';
import { PartnerService } from 'src/app/services/partner.service';

@Component({
  selector: 'app-partner-list',
  templateUrl: './partner-list.component.html',
  styleUrls: ['./partner-list.component.scss']
})
export class PartnerListComponent implements OnInit {

  partnerArray: PartnerModel[] = [];

  constructor(
    private partnerService: PartnerService
  ) { }

  ngOnInit(): void {
    this.partnerArray = this.partnerService.getAll();
  }

}
