import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartsiteComponent } from './startsite.component';

describe('StartsiteComponent', () => {
  let component: StartsiteComponent;
  let fixture: ComponentFixture<StartsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartsiteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
