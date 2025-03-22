import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';  // Import HttpClient
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
[x: string]: any;
  users: any[] = [];  // Array to store users displayed in the table
  newUser: any = {} ;  // New user data to be added

  constructor(private http: HttpClient) {}

  addUser() {
    console.log('New user data before submitting:', this.newUser);  // Log the data before sending it
  
    this.http.post('http://localhost:3000/api/users', this.newUser)
      .subscribe((response: any) => {
        console.log('User added:', response);
        this.users.push(response);  // Add the new user to the table
        this.newUser = {};  // Reset form fields
      }, error => {
        console.error('Error adding user:', error);  // Handle error response
      });
  }
  
  ngOnInit() {
    // Fetch existing users from the backend when the component initializes
    this.http.get('http://localhost:3000/api/users')
      .subscribe((response: any) => {
        this.users = response;  // Populate the table with existing users
      });
  }
  
  deleteUser(id: number) {
    if (confirm("Are you sure you want to delete this user?")) {
      this.http.delete(`http://localhost:3000/api/users/${id}`)
        .subscribe(() => {
          console.log(`User with ID ${id} deleted`);
          this.users = this.users.filter(user => user.id !== id); // Remove user from UI
        });
    }
  }
  
}
