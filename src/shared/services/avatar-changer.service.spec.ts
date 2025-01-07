import { TestBed } from '@angular/core/testing';

import { AvatarChangerService } from './avatar-changer.service';

describe('AvatarChangerService', () => {
  let service: AvatarChangerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvatarChangerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
