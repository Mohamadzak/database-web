import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, catchError, switchMap, tap, of } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private usersSubject = new BehaviorSubject<any[]>([]); // RxJS BehaviorSubject for users
  users$ = this.usersSubject.asObservable(); // Observable for UI binding
  newUser: any = {}; // New user data

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Fetch users when component initializes
    this.fetchUsers();
  }

  fetchUsers() {
    this.http.get<any[]>('http://localhost:3000/api/users')
      .pipe(
        tap(users => this.usersSubject.next(users)), // Update BehaviorSubject
        catchError(error => {
          console.error('Error fetching users:', error);
          return of([]); // Return an empty array in case of error
        })
      )
      .subscribe();
  }

  addUser() {
    console.log('New user data before submitting:', this.newUser);
    
    this.http.post<any>('http://localhost:3000/api/users', this.newUser)
      .pipe(
        tap(response => {
          console.log('User added:', response);
          this.usersSubject.next([...this.usersSubject.value, response]); // Add new user reactively
          this.newUser = {}; // Reset form
        }),
        catchError(error => {
          console.error('Error adding user:', error);
          return of(null); // Handle error without breaking the stream
        })
      )
      .subscribe();
  }

  deleteUser(id: number) {
    if (confirm("Are you sure you want to delete this user?")) {
      this.http.delete(`http://localhost:3000/api/users/${id}`)
        .pipe(
          tap(() => {
            console.log(`User with ID ${id} deleted`);
            this.usersSubject.next(this.usersSubject.value.filter(user => user.id !== id)); // Remove user reactively
          }),
          catchError(error => {
            console.error('Error deleting user:', error);
            return of(null); // Handle error gracefully
          })
        )
        .subscribe();
    }
  }
}
