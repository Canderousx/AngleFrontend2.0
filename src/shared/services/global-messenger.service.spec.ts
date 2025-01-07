import { TestBed } from '@angular/core/testing';

import { GlobalMessengerService } from './global-messenger.service';

describe('GlobalMessengerService', () => {
  let service: GlobalMessengerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalMessengerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
