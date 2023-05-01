import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { CatModel } from 'src/app/models/cat.model';
import { MemberModel } from 'src/app/models/member.model';
import { AuthService } from 'src/app/services/auth.service';
import { CatHttpService } from 'src/app/services/baseHttp/cat-http.service';

@Component({
  selector: 'app-cat-editor',
  templateUrl: './cat-editor.component.html',
  styleUrls: ['./cat-editor.component.scss']
})
export class CatEditorComponent implements OnInit, OnDestroy {

  user?: MemberModel | null;
  cat?: CatModel;
  catId?: string | null;
  subsCat?: Subscription;
  formValue = {};
  colors = [
    "black", "white", "orange", "tabby", "bicolor", "calico", "smoke"
  ]

  public editorForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    sex: new FormControl(null, [Validators.required]),
    color: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    imgUrl: new FormControl('', [Validators.required]),
    adoptable: new FormControl(true, [Validators.required])
  });


  constructor(
    private authService: AuthService,
    private catService: CatHttpService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.activatedRoute.paramMap.subscribe({
      next: (param) => {
        if (param.get('id')) {
          this.catId = param.get('id');
        }
      }
    })
  }

  ngOnInit(): void {

    this.authService.userObject.subscribe((u) => {
      this.user = u;
      if (u?.role === "ADMIN") {

        if (this.catId) {
          this.subsCat = this.catService.findById(this.catId).subscribe(
            (cat: CatModel) => {
              this.cat = cat;
              if (cat) {
                this.editorForm.patchValue({
                  name: this.cat.name,
                  sex: this.cat.sex,
                  color: this.cat.color,
                  description: this.cat.description,
                  imgUrl: this.cat.imgUrl,
                  adoptable: this.cat.adoptable
                })
                this.formValue = this.editorForm.value;
              }
            }

          )
        }
      }
    })
  }


  ngOnDestroy(): void {
    this.subsCat?.unsubscribe();
  }

  saveCat() {
    const editedFormValue = this.editorForm.value;
    if (editedFormValue !== this.formValue && this.editorForm.valid && this.user?.role === 'ADMIN') {
      const editedCatData: CatModel = {
        name: editedFormValue.name,
        sex: editedFormValue.sex,
        color: editedFormValue.color,
        description: editedFormValue.description,
        imgUrl: editedFormValue.imgUrl,
        adoptable: editedFormValue.adoptable
      }

      let updateProcess: Observable<CatModel> = this.catId
        ? this.catService.update(this.cat!._id!, editedCatData)
        : this.catService.create(editedCatData)

      updateProcess.subscribe({
        next: (savedCat) => {
          this.toastr.success('Cat saved successfully.', 'Done!');
          this.editorForm.reset();
          this.router.navigate(['catList']);
        },
        error: (err) => {
          this.toastr.error('Try again later.', 'Oops!');
        }
      })
    }
  }



  goBack() {
    this.router.navigate(['catList']);
  }

  public get name(): FormControl {
    return this.editorForm.controls['name'] as FormControl;
  }

  public get sex(): FormControl {
    return this.editorForm.controls['sex'] as FormControl;
  }

  public get color(): FormControl {
    return this.editorForm.controls['color'] as FormControl;
  }

  public get description(): FormControl {
    return this.editorForm.controls['description'] as FormControl;
  }

  public get imgUrl(): FormControl {
    return this.editorForm.controls['imgUrl'] as FormControl;
  }

  public get adoptable(): FormControl {
    return this.editorForm.controls['adoptable'] as FormControl;
  }

}
