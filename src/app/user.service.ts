import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000'; // Backend API URL

  constructor(private http: HttpClient) {}

  // Fetch all users from MySQL
  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Insert new user into MySQL
  addUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }
}
