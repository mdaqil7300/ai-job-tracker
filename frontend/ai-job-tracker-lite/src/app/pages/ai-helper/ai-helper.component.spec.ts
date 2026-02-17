import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiHelperComponent } from './ai-helper.component';

describe('AiHelperComponent', () => {
  let component: AiHelperComponent;
  let fixture: ComponentFixture<AiHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiHelperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AiHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
