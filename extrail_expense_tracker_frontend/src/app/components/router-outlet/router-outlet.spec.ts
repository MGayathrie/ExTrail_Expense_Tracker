import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterOutlet } from './router-outlet';

describe('RouterOutlet', () => {
  let component: RouterOutlet;
  let fixture: ComponentFixture<RouterOutlet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterOutlet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouterOutlet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
