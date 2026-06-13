import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackRecords } from './track-records';

describe('TrackRecords', () => {
  let component: TrackRecords;
  let fixture: ComponentFixture<TrackRecords>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackRecords],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackRecords);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
