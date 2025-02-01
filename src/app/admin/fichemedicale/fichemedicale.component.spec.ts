import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FichemedicaleComponent } from './fichemedicale.component';

describe('FichemedicaleComponent', () => {
  let component: FichemedicaleComponent;
  let fixture: ComponentFixture<FichemedicaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FichemedicaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FichemedicaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
