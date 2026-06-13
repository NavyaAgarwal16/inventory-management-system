import { TestBed } from '@angular/core/testing';

import { TrackRecord } from './track-record';

describe('TrackRecord', () => {
  let service: TrackRecord;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackRecord);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
