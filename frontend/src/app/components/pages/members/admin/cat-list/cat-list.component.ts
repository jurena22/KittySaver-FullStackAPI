import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { CatModel } from 'src/app/models/cat.model';
import { MemberModel } from 'src/app/models/member.model';
import { AuthService } from 'src/app/services/auth.service';

import { CatHttpService } from 'src/app/services/baseHttp/cat-http.service';

@Component({
  selector: 'app-cat-list',
  templateUrl: './cat-list.component.html',
  styleUrls: ['./cat-list.component.scss']
})
export class CatListComponent implements OnInit {

  catsArray$?: Observable<CatModel[]>;

  user?: MemberModel | null;

  constructor(
    private authService: AuthService,
    private catService: CatHttpService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.authService.userObject.subscribe((u)=>{
      this.user = u;
    });
    
    if(this.user?.role === 'ADMIN'){
      this.loadData();
    }
  }

  editCat(id: string){
    if(this.user?.role === 'ADMIN'){
      this.router.navigate(['editCat', id]);
    }
  }

  deleteCat(id: string){
    if (id && confirm("Do you really want to delete this cat?")){
      this.catService.delete(id).subscribe({
        next: (data)=>{
          this.toastr.success('Deleted successfully', 'Done!')
          this.loadData();
        },
        error: (err) => {
          this.toastr.error('Try it later please.', 'Oops!')
        }
      });
    }

  }

  loadData(){
    this.catsArray$ = this.catService.findAll();
  }

  
  goToCatForm(){
    this.router.navigate(['editCat']);
  }

}
