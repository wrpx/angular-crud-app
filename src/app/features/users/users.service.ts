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
      fullName: 'สมชาย ใจดี',
      email: 'somchai@example.com',
      avatar: 'https://i.pravatar.cc/150?img=1',
      role: 'ผู้ดูแลระบบ',
      status: 'active',
      lastLogin: new Date('2025-01-19T10:30:00')
    },
    {
      id: 2,
      fullName: 'สมหญิง รักดี',
      email: 'somying@example.com',
      avatar: 'https://i.pravatar.cc/150?img=2',
      role: 'ผู้ใช้งานทั่วไป',
      status: 'active',
      lastLogin: new Date('2025-01-18T15:45:00')
    },
    {
      id: 3,
      fullName: 'วิชัย สุขสันต์',
      email: 'wichai@example.com',
      avatar: 'https://i.pravatar.cc/150?img=3',
      role: 'ผู้จัดการ',
      status: 'inactive',
      lastLogin: new Date('2025-01-15T09:20:00')
    },
    {
      id: 4,
      fullName: 'รัตนา มั่นคง',
      email: 'rattana@example.com',
      avatar: 'https://i.pravatar.cc/150?img=4',
      role: 'ผู้ใช้งานทั่วไป',
      status: 'active',
      lastLogin: new Date('2025-01-19T08:15:00')
    },
    {
      id: 5,
      fullName: 'ประเสริฐ ดีเลิศ',
      email: 'prasert@example.com',
      avatar: 'https://i.pravatar.cc/150?img=5',
      role: 'ผู้จัดการ',
      status: 'active',
      lastLogin: new Date('2025-01-17T16:30:00')
    },
    {
      id: 6,
      fullName: 'นภา สดใส',
      email: 'napha@example.com',
      avatar: 'https://i.pravatar.cc/150?img=6',
      role: 'ผู้ใช้งานทั่วไป',
      status: 'active',
      lastLogin: new Date('2025-01-19T11:20:00')
    },
    {
      id: 7,
      fullName: 'สมศักดิ์ มีสุข',
      email: 'somsak@example.com',
      avatar: 'https://i.pravatar.cc/150?img=7',
      role: 'ผู้จัดการ',
      status: 'active',
      lastLogin: new Date('2025-01-18T14:30:00')
    },
    {
      id: 8,
      fullName: 'วันดี สุขสันต์',
      email: 'wandee@example.com',
      avatar: 'https://i.pravatar.cc/150?img=8',
      role: 'ผู้ใช้งานทั่วไป',
      status: 'inactive',
      lastLogin: new Date('2025-01-16T09:45:00')
    },
    {
      id: 9,
      fullName: 'ชัยวัฒน์ รุ่งเรือง',
      email: 'chaiwat@example.com',
      avatar: 'https://i.pravatar.cc/150?img=9',
      role: 'ผู้ดูแลระบบ',
      status: 'active',
      lastLogin: new Date('2025-01-19T10:15:00')
    },
    {
      id: 10,
      fullName: 'มานี มีทรัพย์',
      email: 'manee@example.com',
      avatar: 'https://i.pravatar.cc/150?img=10',
      role: 'ผู้จัดการ',
      status: 'active',
      lastLogin: new Date('2025-01-17T13:20:00')
    },
    {
      id: 11,
      fullName: 'สุชาติ ใจดี',
      email: 'suchart@example.com',
      avatar: 'https://i.pravatar.cc/150?img=11',
      role: 'ผู้ใช้งานทั่วไป',
      status: 'active',
      lastLogin: new Date('2025-01-19T09:30:00')
    },
    {
      id: 12,
      fullName: 'พรทิพย์ สุขใจ',
      email: 'porntip@example.com',
      avatar: 'https://i.pravatar.cc/150?img=12',
      role: 'ผู้จัดการ',
      status: 'inactive',
      lastLogin: new Date('2025-01-15T11:45:00')
    },
    {
      id: 13,
      fullName: 'ธนพล รักษ์ดี',
      email: 'thanapol@example.com',
      avatar: 'https://i.pravatar.cc/150?img=13',
      role: 'ผู้ใช้งานทั่วไป',
      status: 'active',
      lastLogin: new Date('2025-01-18T16:20:00')
    },
    {
      id: 14,
      fullName: 'สุภาพร ยิ้มแย้ม',
      email: 'supaporn@example.com',
      avatar: 'https://i.pravatar.cc/150?img=14',
      role: 'ผู้ดูแลระบบ',
      status: 'active',
      lastLogin: new Date('2025-01-19T08:45:00')
    },
    {
      id: 15,
      fullName: 'อนันต์ มั่งมี',
      email: 'anan@example.com',
      avatar: 'https://i.pravatar.cc/150?img=15',
      role: 'ผู้จัดการ',
      status: 'active',
      lastLogin: new Date('2025-01-17T14:30:00')
    },
    {
      id: 16,
      fullName: 'วิภา สดใส',
      email: 'wipa@example.com',
      avatar: 'https://i.pravatar.cc/150?img=16',
      role: 'ผู้ใช้งานทั่วไป',
      status: 'active',
      lastLogin: new Date('2025-01-19T10:45:00')
    },
    {
      id: 17,
      fullName: 'สมพงษ์ ใจเย็น',
      email: 'sompong@example.com',
      avatar: 'https://i.pravatar.cc/150?img=17',
      role: 'ผู้จัดการ',
      status: 'inactive',
      lastLogin: new Date('2025-01-16T13:20:00')
    },
    {
      id: 18,
      fullName: 'นงลักษณ์ สุขสม',
      email: 'nonglak@example.com',
      avatar: 'https://i.pravatar.cc/150?img=18',
      role: 'ผู้ใช้งานทั่วไป',
      status: 'active',
      lastLogin: new Date('2025-01-18T11:30:00')
    },
    {
      id: 19,
      fullName: 'ประพันธ์ มีเงิน',
      email: 'prapan@example.com',
      avatar: 'https://i.pravatar.cc/150?img=19',
      role: 'ผู้ดูแลระบบ',
      status: 'active',
      lastLogin: new Date('2025-01-19T09:15:00')
    },
    {
      id: 20,
      fullName: 'จินตนา รักสงบ',
      email: 'jintana@example.com',
      avatar: 'https://i.pravatar.cc/150?img=20',
      role: 'ผู้จัดการ',
      status: 'active',
      lastLogin: new Date('2025-01-17T15:45:00')
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

  addUser(user: Omit<User, 'id'>): Observable<User> {
    const newUser: User = {
      ...user,
      id: this.users.length + 1,
      lastLogin: new Date()
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

  deleteMultipleUsers(ids: number[]): Observable<boolean> {
    this.users = this.users.filter(u => !ids.includes(u.id));
    this.usersSubject.next(this.users);
    return of(true);
  }
}
