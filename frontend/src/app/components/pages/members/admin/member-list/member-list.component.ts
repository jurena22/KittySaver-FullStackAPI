import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MemberModel } from 'src/app/models/member.model';
import { MemberHttpService } from 'src/app/services/baseHttp/member-http.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent implements OnInit {

  membersArray: MemberModel[] = [];

  constructor(
    private memberService: MemberHttpService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  editMember(id: string){
    this.router.navigate(['editProfile', id]);
  }

  deleteMember(id: string){
    if (id && confirm("Do you really want to delete this member?")){
      this.memberService.delete(id).subscribe({
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
    this.memberService.findAll().subscribe({next: (members: MemberModel[]) => this.membersArray = members});
  }

}
