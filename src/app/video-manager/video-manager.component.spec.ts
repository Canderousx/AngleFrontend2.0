import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoManagerComponent } from './video-manager.component';

describe('VideoManagerComponent', () => {
  let component: VideoManagerComponent;
  let fixture: ComponentFixture<VideoManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoManagerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VideoManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
