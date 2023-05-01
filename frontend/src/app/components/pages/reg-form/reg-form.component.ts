import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MemberModel } from 'src/app/models/member.model';
import { MemberHttpService } from 'src/app/services/baseHttp/member-http.service';

@Component({
  selector: 'app-reg-form',
  templateUrl: './reg-form.component.html',
  styleUrls: ['./reg-form.component.scss']
})
export class RegFormComponent implements OnInit {

  public memberRegForm!: FormGroup;

  constructor(
    private router: Router,
    private memberService: MemberHttpService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.memberRegForm = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phoneNumber: new FormControl(null, [Validators.required]),
      city: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required]),
      password: new FormControl(null, [Validators.required]),
      confirmPassword: new FormControl(null, [Validators.required]),
      rulesAccepted: new FormControl(false, [Validators.requiredTrue])
    }, { validators: this.checkPasswordsValidator })
  }

  //getters
  public get firstName(): FormControl {
    return this.memberRegForm.controls['firstName'] as FormControl;
  }
  
  public get lastName(): FormControl {
    return this.memberRegForm.controls['lastName'] as FormControl;
  }
  
  public get city(): FormControl {
    return this.memberRegForm.controls['city'] as FormControl;
  }
  public get address(): FormControl {
    return this.memberRegForm.controls['address'] as FormControl;
  }
  
  public get phoneNumber(): FormControl {
    return this.memberRegForm.controls['phoneNumber'] as FormControl;
  }
  
  public get email(): FormControl {
    return this.memberRegForm.controls['email'] as FormControl;
  }
  
  public get password(): FormControl {
    return this.memberRegForm.controls['password'] as FormControl;
  }
  
  public get confirmPassword(): FormControl {
    return this.memberRegForm.controls['confirmPassword'] as FormControl;
  }
  public get rules(): FormControl {
    return this.memberRegForm.controls['rulesAccepted'] as FormControl;
  }


  checkPasswordsValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
  
    return password && confirmPassword && password.value !== confirmPassword.value ? { checkPasswords: true } : null;
  };

  saveMember(): void {
    if(this.memberRegForm.valid){
      const memberRegData = this.memberRegForm.value;
      const memberData: MemberModel = {
        name: `${memberRegData.firstName} ${memberRegData.lastName}`,
        phoneNumber: memberRegData.phoneNumber,
        address: `${memberRegData.city}, ${memberRegData.address}`,
        email: memberRegData.email,
        password: memberRegData.password,
        messages: [],
        role: 'MEMBER'
      }
      
      this.memberService.create(memberData).subscribe({
        next: (savedPerson)=>{
          this.memberRegForm.reset();
          this.toastr.success('Login with your email and password.', `Welcome ${savedPerson.name} at KittySaver!`);
          this.router.navigate(['members']);
        },
        error: (err) => {
          this.toastr.error('Try it later please.', 'Oops!');
        },
        complete: () => {}
      })

    }
  }

  goToLogin(): void {
    this.router.navigate(["login"]);
  }


}
