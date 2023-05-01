import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  public get email() {
    return this.loginForm.get('email');
  }
  public get password() {
    return this.loginForm.get('password');
  }


  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
  }

  public submitLogin(){
    const loginData = this.loginForm.value;

    if(loginData.email && loginData.password) {
      
      this.authService.login(loginData).subscribe({
        next: (userObj)=>{
          this.loginForm.reset();
          this.router.navigate(['members']);
        },
        error: (err) => {
          this.loginForm.reset();
          this.toastr.error('Try it again with valid email and password.', 'Login failed!')
        }
      })

    }
  }

  goToRegistration(): void {
    this.router.navigate(["registrate"]);
  }


}
