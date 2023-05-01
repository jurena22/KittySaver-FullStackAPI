import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CardElementModel } from 'src/app/models/cardElement.model';
import { PartnerModel } from 'src/app/models/partner.model';
import { PartnerService } from 'src/app/services/partner.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() cardElements: CardElementModel[] = [];
 

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  
  }

  goToDetails(id: string): void {
    this.router.navigate(['cats', id]);
  }

}
