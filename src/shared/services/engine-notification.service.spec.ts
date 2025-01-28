import { TestBed } from '@angular/core/testing';

import { EngineNotificationService } from './engine-notification.service';

describe('EngineNotificationService', () => {
  let service: EngineNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EngineNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
