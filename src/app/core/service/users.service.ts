import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, map, of, catchError, throwError } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'http://localhost:8080/api/users';

  private users: User[] = [];

  private usersSubject = new BehaviorSubject<User[]>(this.users);

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      map((users) =>
        users.map((user) => ({
          ...user,
          lastLogin: new Date(user.lastLogin).toISOString(),
        }))
      )
    );
  }

  getUserById(id: number): Observable<User | undefined> {
    return this.getUsers().pipe(
      map((users) => users.find((user) => user.id === id))
    );
  }

  addUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteMultipleUsers(ids: number[]): Observable<void> {
    return this.http.delete<void>(this.apiUrl, { body: ids }).pipe(
      catchError(this.handleError)
    );
  }

  getAllUsers(params?: any): Observable<any> {
    return this.http.get<User[]>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
    if (error.error?.message) {
      errorMessage = error.error.message;
    }
    return throwError(() => errorMessage);
  }
}
