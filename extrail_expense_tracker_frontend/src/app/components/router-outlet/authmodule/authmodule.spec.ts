import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Authmodule } from './authmodule';

describe('Authmodule', () => {
  let component: Authmodule;
  let fixture: ComponentFixture<Authmodule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Authmodule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Authmodule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
