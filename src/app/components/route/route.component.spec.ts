/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RouteComponent } from './route.component';

describe('RouteComponent', () => {
  let component: RouteComponent;
  let fixture: ComponentFixture<RouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
