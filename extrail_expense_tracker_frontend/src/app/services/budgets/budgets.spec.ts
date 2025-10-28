import { TestBed } from '@angular/core/testing';

import { BudgetsService } from './budgets-service';

describe('Budgets', () => {
  let service: BudgetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
