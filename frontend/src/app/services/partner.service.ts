import { Injectable } from '@angular/core';
import { PartnerModel } from '../models/partner.model';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {

  partnerList: PartnerModel[] = [
    {id: "1", name: "Catative Company", description: "Cat ipsum dolor sit amet, have my breakfast spaghetti yarn, lick yarn hanging out of own butt and chew iPad power cord.", imgUrl: "../../../assets/images/vecteezy_vector-icon-of-a-cat-animal-logo-with-an-adorable-pose_6862726.jpg"},
    {id: "2", name: "Creative Cat Company", description: "Cat ipsum dolor sit amet, decide to want nothing to do with my owner today scratch the furniture or refuse to come home when humans are going to bed.", imgUrl: "../../../assets/images/vecteezy_vector-icon-of-a-cat-animal-logo-with-an-adorable-pose_6863080.jpg"},
    {id: "3", name: "Vet Pet Cat", description: "Cat ipsum dolor sit amet, stay out all night then yowl like i am dying at 4am twitch tail in permanent irritation.", imgUrl: "../../../assets/images/12984010891644664341-512.png"},
    {id: "4", name: "Cathy Veterinary Services", description: "Cat ipsum dolor sit amet, If it smells like fish eat as much as you wish pretend you want to go out but then don't go into a room to decide you didn't want to be in there anyway", imgUrl: "../../../assets/images/cat-icon-34376.png"},
    {id: "5", name: "Cat Coffee", description: "Cat ipsum dolor sit amet, tender cattt catt cattty cat being a cat meowing chowing and wowing. Cats go for world domination.", imgUrl: "../../../assets/images/vector60-2987-01.jpg"}

  ]

  constructor() { }

  getAll(): PartnerModel[] {
    return this.partnerList;
  }
}
