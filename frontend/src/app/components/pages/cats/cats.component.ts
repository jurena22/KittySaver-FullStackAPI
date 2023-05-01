import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { CatModel } from 'src/app/models/cat.model';
import { CatHttpService } from 'src/app/services/baseHttp/cat-http.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cats',
  templateUrl: './cats.component.html',
  styleUrls: ['./cats.component.scss']
})
export class CatsComponent implements OnInit, OnDestroy {


  sexProp = ["Male", "Female", "Neutered", "All"];
  colorProp = ["black", "white", "orange", "tabby", "bicolor", "calico", "smoke", "All"];
  selectedCats?: CatModel[];

  catsArray: CatModel[] = [];
  subsCats?: Subscription;

  index: number = -1;

  constructor(
    private catHttpService: CatHttpService
  ) { }

  ngOnInit(): void {
    this.subsCats = this.catHttpService.findAll().subscribe({next: (cats: CatModel[]) => {
      this.catsArray = cats;
      this.selectedCats = cats;

    }
    });

  }

  ngOnDestroy(): void {
    this.subsCats?.unsubscribe();
  }

  findCats(searchForm: NgForm){
    if (searchForm.valid) {
      const { sex, color } = searchForm.value;
    
      this.selectedCats = this.catsArray.filter(cat => (sex === "All" || cat.sex === sex) && (color === "All" || cat.color === color));
    }
  }

  showAllCats(): void {
    this.selectedCats = this.catsArray;
  }

}
