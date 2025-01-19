import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DeleteConfirmationData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-delete-confirmation-dialog',
  template: `
    <div class="p-6">
      <h2 mat-dialog-title class="text-xl font-bold mb-4">{{data.title}}</h2>
      <mat-dialog-content>
        <p class="text-gray-600">{{data.message}}</p>
      </mat-dialog-content>
      <mat-dialog-actions class="flex justify-end gap-3 mt-6">
        <button mat-stroked-button [mat-dialog-close]="false" class="min-w-[100px]">
          ยกเลิก
        </button>
        <button mat-flat-button color="warn" [mat-dialog-close]="true" class="min-w-[100px]">
          ยืนยัน
        </button>
      </mat-dialog-actions>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule]
})
export class DeleteConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteConfirmationData
  ) {}
}