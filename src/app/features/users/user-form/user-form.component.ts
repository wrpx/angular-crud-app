import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/user.model';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDialogModule
  ]
})
export class UserFormComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean;
  roles: string[] = ['ผู้ดูแลระบบ', 'ผู้จัดการ', 'ผู้ใช้งานทั่วไป'];

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private dialogRef: MatDialogRef<UserFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User
  ) {
    this.isEditMode = !!data;
    this.form = this.fb.group({
      fullName: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[ก-๏a-zA-Z\s]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      role: ['', [Validators.required]]
    });

    if (this.isEditMode && data) {
      this.form.patchValue({
        fullName: data.fullName,
        email: data.email,
        role: data.role
      });
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.form.valid) {
      const formData = {
        ...this.form.value,
        status: this.isEditMode ? this.data.status : 'active',
        avatar: this.isEditMode ? this.data.avatar : `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        lastLogin: this.isEditMode ? this.data.lastLogin : new Date()
      };

      if (this.isEditMode) {
        this.usersService.updateUser(this.data.id, formData)
          .subscribe({
            next: (updatedUser) => {
              this.dialogRef.close(updatedUser);
            },
            error: (error) => {
              console.error('Error updating user:', error);
            }
          });
      } else {
        this.usersService.addUser(formData)
          .subscribe({
            next: (newUser) => {
              this.dialogRef.close(newUser);
            },
            error: (error) => {
              console.error('Error adding user:', error);
            }
          });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
