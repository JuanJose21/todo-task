import { environment } from 'src/environments/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

  save(task: any) {
    return this.http.post(environment.apiUrl + 'api/entity/task', task);
  }

  get(user: any) {
    return this.http.get(environment.apiUrl + 'api/entity/task/' + user);
  }

  delete(task: any) {
    return this.http.post(environment.apiUrl + 'api/entity/delete/task', task);
  }

  update(task: any) {
    return this.http.put(environment.apiUrl + 'api/entity/task', task);
  }
}
