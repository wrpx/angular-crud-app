import { Component, OnInit, ViewChild } from '@angular/core';
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

import { User } from '../../../core/models/user.model';
import { UsersService } from '../users.service';
import { UserFormComponent } from '../user-form/user-form.component';

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
    MatSnackBarModule
  ]
})
export class UsersListComponent implements OnInit {
  displayedColumns = [
    'select',
    'id',
    'firstName',
    'lastName',
    'email',
    'phone',
    'role',
    'active',
    'actions'
  ];
  visibleColumns = [...this.displayedColumns];
  dataSource: MatTableDataSource<User>;
  selection = new SelectionModel<User>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private usersService: UsersService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers() {
    this.usersService.getUsers().subscribe(users => {
      this.dataSource.data = users;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  openUserForm(user?: User) {
    const dialogRef = this.dialog.open(UserFormComponent, {
      width: '600px',
      data: user
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadUsers();
      }
    });
  }

  deleteUser(user: User) {
    if (confirm('คุณต้องการลบผู้ใช้นี้ใช่หรือไม่?')) {
      this.usersService.deleteUser(user.id).subscribe({
        next: () => {
          this.loadUsers();
          this.snackBar.open('ลบผู้ใช้สำเร็จ', 'ปิด', { duration: 3000 });
        },
        error: (error) => {
          this.snackBar.open('เกิดข้อผิดพลาดในการลบผู้ใช้', 'ปิด', { duration: 3000 });
        }
      });
    }
  }

  toggleColumn(column: string) {
    const idx = this.visibleColumns.indexOf(column);
    if (idx > -1) {
      this.visibleColumns.splice(idx, 1);
    } else {
      // Maintain original order when adding back
      const originalIdx = this.displayedColumns.indexOf(column);
      this.visibleColumns.splice(originalIdx, 0, column);
    }
  }

  isColumnVisible(column: string): boolean {
    return this.visibleColumns.includes(column);
  }

  getColumnName(column: string): string {
    const columnNames: { [key: string]: string } = {
      'select': 'เลือก',
      'id': 'รหัส',
      'firstName': 'ชื่อ',
      'lastName': 'นามสกุล',
      'email': 'อีเมล',
      'phone': 'เบอร์โทรศัพท์',
      'role': 'บทบาท',
      'active': 'สถานะ',
      'actions': 'จัดการ'
    };
    return columnNames[column] || column;
  }
}
