/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AiService } from './ai.service';

describe('AiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AiService]
    });
  });

  it('should ...', inject([AiService], (service: AiService) => {
    expect(service).toBeTruthy();
  }));
});
