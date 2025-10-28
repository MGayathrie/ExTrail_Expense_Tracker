import { TestBed } from '@angular/core/testing';

import { CategoriesService } from './categories-service';
import { Categories } from '../../components/router-outlet/categories/categories';

describe('Categories', () => {
  let service: Categories;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Categories);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
