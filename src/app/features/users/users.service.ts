import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { User } from '../../core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      firstName: 'จอห์น',
      lastName: 'โด',
      email: 'john@example.com',
      phone: '0891234567',
      role: 'ผู้ดูแลระบบ',
      active: true,
      createdAt: new Date()
    },
    {
      id: 2,
      firstName: 'เจน',
      lastName: 'โด',
      email: 'jane@example.com',
      phone: '0891234568',
      role: 'ผู้ใช้งาน',
      active: true,
      createdAt: new Date()
    }
  ];

  private usersSubject = new BehaviorSubject<User[]>(this.users);

  constructor() { }

  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  getUserById(id: number): Observable<User | undefined> {
    return this.getUsers().pipe(
      map(users => users.find(user => user.id === id))
    );
  }

  addUser(user: Omit<User, 'id' | 'createdAt'>): Observable<User> {
    const newUser: User = {
      ...user,
      id: this.users.length + 1,
      createdAt: new Date()
    };
    this.users = [...this.users, newUser];
    this.usersSubject.next(this.users);
    return of(newUser);
  }

  updateUser(id: number, user: Partial<User>): Observable<User | undefined> {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...user };
      this.usersSubject.next(this.users);
      return of(this.users[index]);
    }
    return of(undefined);
  }

  deleteUser(id: number): Observable<boolean> {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users = this.users.filter(u => u.id !== id);
      this.usersSubject.next(this.users);
      return of(true);
    }
    return of(false);
  }
}
