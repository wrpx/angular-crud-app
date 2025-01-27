export interface User {
  id?: number;
  fullName: string;
  email: string;
  avatar: string;
  role: 'ผู้ดูแลระบบ' | 'ผู้จัดการ' | 'ผู้ใช้งานทั่วไป';
  status: 'active' | 'inactive';
  lastLogin: string;
}
