import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CatModel } from 'src/app/models/cat.model';
import { MemberModel } from 'src/app/models/member.model';
import { AuthService } from 'src/app/services/auth.service';
import { CatHttpService } from 'src/app/services/baseHttp/cat-http.service';

@Component({
  selector: 'app-cat-details',
  templateUrl: './cat-details.component.html',
  styleUrls: ['./cat-details.component.scss']
})
export class CatDetailsComponent implements OnInit, OnDestroy {

  cat?: CatModel;
  subsCat?: Subscription;
  user?: MemberModel | null;

  constructor(
    private catHttpService: CatHttpService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    let catId = this.activatedRoute.snapshot.paramMap.get('id');
    if (catId) {
      this.subsCat = this.catHttpService.findById(catId).subscribe(
            (cat: CatModel) => this.cat = cat
      )
    }

    this.authService.userObject.subscribe((u)=>{
      this.user = u;
    })
  }

  ngOnDestroy(): void {
    this.subsCat?.unsubscribe();
  }

  navigateBackToCats(): void {
    this.router.navigate(['cats']);
  }

  goToLoginAndSaveCat(): void {
    !this.user ? this.router.navigate(['login']) : this.router.navigate(['members'])
  }

}
