import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/pages/about/about.component';
import { CatDetailsComponent } from './components/pages/cats/cat-details/cat-details.component';
import { RegFormComponent } from './components/pages/reg-form/reg-form.component';
import { HomepageComponent } from './components/pages/homepage/homepage.component';
import { CatsComponent } from './components/pages/cats/cats.component';
import { MembersComponent } from './components/pages/members/members.component';
import { LoginComponent } from './components/pages/login/login.component';
import { PageNotFoundComponent } from './components/pages/page-not-found/page-not-found.component';
import { GetInvolvedComponent } from './components/pages/get-involved/get-involved.component';
import { ProfileEditorComponent } from './components/pages/members/profile-editor/profile-editor.component';
import { AuthGuardService } from './guards/auth.guard';
import { CatEditorComponent } from './components/pages/members/admin/cat-editor/cat-editor.component';
import { CatListComponent } from './components/pages/members/admin/cat-list/cat-list.component';
import { MemberListComponent } from './components/pages/members/admin/member-list/member-list.component';
import { MessageListComponent } from './components/pages/members/admin/message-list/message-list.component';


const routes: Routes = [
  {path: "", component: HomepageComponent},
  {path: "about", component: AboutComponent},
  {path: "cats", component: CatsComponent},
  {path: "cats/:id", component: CatDetailsComponent},
  {path: "registrate", component: RegFormComponent},
  {path: "getInvolved", component: GetInvolvedComponent},
  {path: "login", component: LoginComponent},
  {path: "members", component: MembersComponent, canActivate: [AuthGuardService]},
  {path: "editProfile", component: ProfileEditorComponent, canActivate: [AuthGuardService]},
  {path: "editProfile/:id", component: ProfileEditorComponent, canActivate: [AuthGuardService]},
  {path: "catList", component: CatListComponent, canActivate: [AuthGuardService]},
  {path: "editCat", component: CatEditorComponent, canActivate: [AuthGuardService]},
  {path: "editCat/:id", component: CatEditorComponent, canActivate: [AuthGuardService]},
  {path: "memberList", component: MemberListComponent, canActivate: [AuthGuardService]},
  {path: "messageList", component: MessageListComponent, canActivate: [AuthGuardService]},
  {path: "**", component: PageNotFoundComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled', scrollPositionRestoration: "enabled"})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
