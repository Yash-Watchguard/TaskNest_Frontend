import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { employeeguardGuard } from './employeeguard.guard';

describe('employeeguardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => employeeguardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
