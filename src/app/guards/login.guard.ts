

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) {}
  validateUser() {
    if (localStorage['currentUser']) {
      this.router.navigate(['/home']);
      return false;
    } else {
      return true;
    }
  }

  canActivate() {
    return this.validateUser();
  }

  canLoad() {
    return this.validateUser();
  }
}
