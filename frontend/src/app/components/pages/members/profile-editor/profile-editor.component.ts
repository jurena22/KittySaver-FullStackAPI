import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MemberModel } from 'src/app/models/member.model';
import { AuthService } from 'src/app/services/auth.service';
import { MemberHttpService } from 'src/app/services/baseHttp/member-http.service';


@Component({
  selector: 'app-profile-editor',
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.scss']
})
export class ProfileEditorComponent implements OnInit, OnDestroy {

  formValue = {};
  user?: MemberModel | null;
  member?: MemberModel | null;
  memberId?: string | null;
  memberSubs?: Subscription;

  public editorForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    phoneNumber: new FormControl(null, [Validators.required]),
    city: new FormControl(null, [Validators.required]),
    address: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required])
  });

  constructor(
    private memberService: MemberHttpService,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.paramMap.subscribe({
      next: (param) => {
        if (param.get('id')){
          this.memberId = param.get('id');
        }
      }
    })
   }

  ngOnInit(): void {
    this.authService.userObject.subscribe((u)=>{
      this.user = u;

      if (u?.role === "ADMIN" && this.memberId === u._id) {
          this.member === u;        
      }

      if (this.memberId) {
        this.memberSubs = this.memberService.findById(this.memberId).subscribe(
          (member: MemberModel) => {
            this.member = member;
            if (member) {
              this.editorForm.patchValue({
                firstName: this.member.name.split(" ")[0],
                lastName: this.member.name.split(" ")[1],
                email: this.member.email,
                phoneNumber: this.member.phoneNumber,
                city: this.member.address.split(", ")[0],
                address: this.member.address.split(", ").splice(1).join(" "),
                password: this.member.password
              })
              this.formValue = this.editorForm.value;
            }
          }
        )
      }


    })
  }



  // getters
  public get firstName(): FormControl {
    return this.editorForm.controls['firstName'] as FormControl;
  }
  
  public get lastName(): FormControl {
    return this.editorForm.controls['lastName'] as FormControl;
  }
  
  public get city(): FormControl {
    return this.editorForm.controls['city'] as FormControl;
  }
  public get address(): FormControl {
    return this.editorForm.controls['address'] as FormControl;
  }
  
  public get phoneNumber(): FormControl {
    return this.editorForm.controls['phoneNumber'] as FormControl;
  }
  
  public get email(): FormControl {
    return this.editorForm.controls['email'] as FormControl;
  }
  
  public get password(): FormControl {
    return this.editorForm.controls['password'] as FormControl;
  }
 

  saveProfile(){
    const editedFormValue = this.editorForm.value;
    if(editedFormValue !== this.formValue && this.editorForm.valid && this.user && this.memberId && this.member){
        const editedMemberData: MemberModel = {
          name: `${editedFormValue.firstName} ${editedFormValue.lastName}`,
          phoneNumber: editedFormValue.phoneNumber,
          address: `${editedFormValue.city}, ${editedFormValue.address}`,
          email: editedFormValue.email,
          password: editedFormValue.password,
          messages: this.member.messages,
          role: this.member.role
        }
  
        this.memberService.update(this.memberId, editedMemberData).subscribe({
          next: (savedPerson)=>{
            this.toastr.success('Your changes saved successfully!', 'Done!');
            this.editorForm.reset();
            if (this.user?.role === "ADMIN"){
              this.memberId !== this.user._id ? this.router.navigate(['memberList']) : this.router.navigate(['members']);
            } else {
              this.router.navigate(['members']);
            }
          },
          error: (err) => {
            this.toastr.error('Try it later please.', 'Oops!')
          }
        })
      }
  }

  goBack() {
    if (this.user?.role === "ADMIN"){
      this.memberId !== this.user._id ? this.router.navigate(['memberList']) : this.router.navigate(['members']);
    } else {
      this.router.navigate(['members']);
    }
  }

ngOnDestroy(): void {
  this.memberId = null;
  this.memberSubs?.unsubscribe();
}

}
