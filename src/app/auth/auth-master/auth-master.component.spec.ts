import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthMasterComponent } from './auth-master.component';

describe('AuthMasterComponent', () => {
  let component: AuthMasterComponent;
  let fixture: ComponentFixture<AuthMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
