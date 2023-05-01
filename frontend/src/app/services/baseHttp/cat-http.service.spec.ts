import { TestBed } from '@angular/core/testing';

import { CatHttpService } from './cat-http.service';

describe('CatHttpService', () => {
  let service: CatHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
