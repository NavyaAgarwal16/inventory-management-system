import { TestBed } from '@angular/core/testing';

import { DispatchProduct } from './dispatch-product';

describe('DispatchProduct', () => {
  let service: DispatchProduct;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DispatchProduct);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
