import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashbordSecretaireComponent } from './dashbord-secretaire.component';

describe('DashbordSecretaireComponent', () => {
  let component: DashbordSecretaireComponent;
  let fixture: ComponentFixture<DashbordSecretaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashbordSecretaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashbordSecretaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
