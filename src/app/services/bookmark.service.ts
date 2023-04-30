import { environment } from 'src/environments/environment';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BookmarkService {
  constructor(private http: HttpClient) {}

  save(book: any) {
    return this.http.post(environment.apiUrl + 'api/entity/bookmark', book);
  }

  get(user: any) {
    return this.http.get(environment.apiUrl + 'api/entity/bookmark/' + user);
  }

  delete(book: any) {
    return this.http.post(
      environment.apiUrl + 'api/entity/delete/bookmark',
      book
    );
  }
}
