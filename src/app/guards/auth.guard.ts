import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private router: Router) {}

  validateUser() {
    if (localStorage['currentUser']) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  canActivate() {
    return this.validateUser();
  }

  canLoad() {
    return this.validateUser();
  }
}
