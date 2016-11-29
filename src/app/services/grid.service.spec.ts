/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GridService } from './grid.service';

describe('GridService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GridService]
    });
  });

  it('should ...', inject([GridService], (service: GridService) => {
    expect(service).toBeTruthy();
  }));
});
