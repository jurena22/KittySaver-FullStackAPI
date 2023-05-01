import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about/about.component';
import { CatDetailsComponent } from './cats/cat-details/cat-details.component';
import { CatsComponent } from './cats/cats.component';
import { HomepageComponent } from './homepage/homepage.component';
import { LoginComponent } from './login/login.component';
import { MembersComponent } from './members/members.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { RegFormComponent } from './reg-form/reg-form.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GetInvolvedComponent } from './get-involved/get-involved.component';
import { ProfileComponent } from './members/profile/profile.component';
import { ProfileEditorComponent } from './members/profile-editor/profile-editor.component';
import { CatEditorComponent } from './members/admin/cat-editor/cat-editor.component';
import { CatListComponent } from './members/admin/cat-list/cat-list.component';
import { MemberListComponent } from './members/admin/member-list/member-list.component';
import { MessageListComponent } from './members/admin/message-list/message-list.component';




@NgModule({
  declarations: [
    AboutComponent,
    CatDetailsComponent,
    CatsComponent,
    HomepageComponent,
    LoginComponent,
    MembersComponent,
    PageNotFoundComponent,
    RegFormComponent,
    GetInvolvedComponent,
    ProfileComponent,
    ProfileEditorComponent,
    CatEditorComponent,
    CatListComponent,
    MemberListComponent,
    MessageListComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule
  ]
})
export class PagesModule { }
