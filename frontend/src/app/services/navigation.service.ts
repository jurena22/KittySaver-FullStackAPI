import { Injectable } from '@angular/core';
import { NavDataModel } from '../models/navData.model';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  navLinks: NavDataModel[] = [
    {name: 'Our story', routerLink: 'about'},
    {name: 'Owner hunters', routerLink: 'cats'},
    {name: 'Get involved', routerLink: 'getInvolved'}
  ]

  constructor() { }
}
