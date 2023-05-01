import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CardComponent } from './card/card.component';
import { JoinUsComponent } from './join-us/join-us.component';
import { PartnerListComponent } from './partner-list/partner-list.component';
import { HeroComponent } from './hero/hero.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    CardComponent,
    JoinUsComponent,
    PartnerListComponent,
    HeroComponent,
    NavbarComponent,
    ContactFormComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    CardComponent,
    JoinUsComponent,
    PartnerListComponent,
    HeroComponent,
    NavbarComponent,
    ContactFormComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
