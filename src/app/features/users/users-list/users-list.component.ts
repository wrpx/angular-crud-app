import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { DatePipe } from '@angular/common';

import { User } from '../../../core/models/user.model';
import { UsersService } from '../users.service';
import { UserFormComponent } from '../user-form/user-form.component';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule,
    MatDividerModule,
  ],
  providers: [DatePipe],
})
export class UsersListComponent implements OnInit, AfterViewInit {
  displayedColumns = [
    'select',
    'avatar',
    'fullName',
    'email',
    'role',
    'status',
    'lastLogin',
  ];
  dataSource = new MatTableDataSource<User>();
  selection = new SelectionModel<User>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pageSize = 5;
  pageSizeOptions = [5, 10];

  constructor(
    private dialog: MatDialog,
    private usersService: UsersService,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe
  ) {
    const mockUsers: User[] = [
      {
        id: 1,
        fullName: 'สมชาย ใจดี',
        email: 'somchai@example.com',
        avatar: 'https://i.pravatar.cc/150?img=1',
        role: 'ผู้ดูแลระบบ',
        status: 'active',
        lastLogin: new Date('2025-01-19T10:30:00'),
      },
      {
        id: 2,
        fullName: 'สมหญิง รักดี',
        email: 'somying@example.com',
        avatar: 'https://i.pravatar.cc/150?img=2',
        role: 'ผู้ใช้งานทั่วไป',
        status: 'active',
        lastLogin: new Date('2025-01-18T15:45:00'),
      },
      {
        id: 3,
        fullName: 'วิชัย สุขสันต์',
        email: 'wichai@example.com',
        avatar: 'https://i.pravatar.cc/150?img=3',
        role: 'ผู้จัดการ',
        status: 'inactive',
        lastLogin: new Date('2025-01-15T09:20:00'),
      },
      {
        id: 4,
        fullName: 'รัตนา มั่นคง',
        email: 'rattana@example.com',
        avatar: 'https://i.pravatar.cc/150?img=4',
        role: 'ผู้ใช้งานทั่วไป',
        status: 'active',
        lastLogin: new Date('2025-01-19T08:15:00'),
      },
      {
        id: 5,
        fullName: 'ประเสริฐ ดีเลิศ',
        email: 'prasert@example.com',
        avatar: 'https://i.pravatar.cc/150?img=5',
        role: 'ผู้จัดการ',
        status: 'active',
        lastLogin: new Date('2025-01-17T16:30:00'),
      },
    ];
    this.dataSource.data = mockUsers;
  }

  ngOnInit() {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy HH:mm') || '';
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  isAddDisabled(): boolean {
    return this.selection.selected.length > 0;
  }

  isEditDisabled(): boolean {
    return this.isAllSelected() || this.selection.selected.length !== 1;
  }

  openUserForm(user?: User): void {
    if (!user && this.selection.selected.length > 0) return;

    if (user && (this.isAllSelected() || this.selection.selected.length !== 1))
      return;

    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '500px',
      data: user,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadUsers();
        this.selection.clear();
      }
    });
  }

  deleteSelectedUsers() {
    if (this.selection.selected.length === 0) {
      return;
    }

    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'ยืนยันการลบ',
        message: `คุณต้องการลบผู้ใช้ที่เลือกทั้งหมด ${this.selection.selected.length} รายการใช่หรือไม่?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const selectedIds = this.selection.selected.map((user) => user.id);
        this.usersService
          .deleteMultipleUsers(selectedIds)
          .subscribe((success) => {
            if (success) {
              this.selection.clear();
              this.snackBar.open('ลบผู้ใช้ที่เลือกสำเร็จ', 'ปิด', {
                duration: 3000,
              });
              this.loadUsers();
            }
          });
      }
    });
  }

  toggleColumn(column: string) {
    const idx = this.displayedColumns.indexOf(column);
    if (idx > -1) {
      this.displayedColumns = this.displayedColumns.filter(
        (col) => col !== column
      );
    } else {
      const actionsIndex = this.displayedColumns.indexOf('actions');
      this.displayedColumns.splice(actionsIndex, 0, column);
    }
  }

  isColumnVisible(column: string): boolean {
    return this.displayedColumns.includes(column);
  }

  getColumnName(column: string): string {
    const columnNames: { [key: string]: string } = {
      avatar: 'รูปโปรไฟล์',
      fullName: 'ชื่อ-นามสกุล',
      email: 'อีเมล',
      role: 'บทบาท',
      status: 'สถานะ',
      lastLogin: 'เข้าสู่ระบบล่าสุด',
    };
    return columnNames[column] || column;
  }

  private loadUsers() {
    this.usersService.getUsers().subscribe((users) => {
      this.dataSource.data = users;
    });
  }

  onRowClick(row: User): void {
    this.selection.toggle(row);
  }
}
