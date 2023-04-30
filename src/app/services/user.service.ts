import { environment } from 'src/environments/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  login(user: any) {
    return this.http.post(environment.apiUrl + 'api/users/login', user);
  }

  register(user: any) {
    return this.http.post<{ message: string }>(
      environment.apiUrl + 'api/users/register',
      user
    );
  }
}
