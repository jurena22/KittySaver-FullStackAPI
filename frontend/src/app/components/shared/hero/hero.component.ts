import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {

  @Input() backgroundUrl?: string;
  @Input() titleText?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
