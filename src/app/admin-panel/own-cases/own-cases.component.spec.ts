import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnCasesComponent } from './own-cases.component';

describe('OwnCasesComponent', () => {
  let component: OwnCasesComponent;
  let fixture: ComponentFixture<OwnCasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnCasesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OwnCasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
