import { TestBed } from '@angular/core/testing';

import { FichemedicaleService } from './fichemedicale.service';

describe('FichemedicaleService', () => {
  let service: FichemedicaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FichemedicaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
