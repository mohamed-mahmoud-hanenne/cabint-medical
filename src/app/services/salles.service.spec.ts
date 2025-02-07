import { TestBed } from '@angular/core/testing';

import { SallesService } from './salles.service';

describe('SallesService', () => {
  let service: SallesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SallesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
