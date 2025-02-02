import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/get-all`).pipe(
      map((users) =>
        users.map((user) => ({
          ...user,
          lastLogin: new Date(user.lastLogin).toISOString(),
        }))
      ),
      catchError(this.handleError)
    );
  }

  getUserById(id: number): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/get/${id}`)
      .pipe(catchError(this.handleError));
  }

  addUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http
      .post<User>(`${this.apiUrl}/create`, user)
      .pipe(catchError(this.handleError));
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http
      .put<User>(`${this.apiUrl}/update/${id}`, user)
      .pipe(catchError(this.handleError));
  }

  deleteUser(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/delete/${id}`)
      .pipe(catchError(this.handleError));
  }

  deleteMultipleUsers(ids: number[]): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/delete/batch`, { body: ids })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
    if (error.error?.message) {
      errorMessage = error.error.message;
    }
    return throwError(() => errorMessage);
  }
}
