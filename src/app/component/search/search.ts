import { Component, Inject, OnInit, Optional } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './search.html',
  styleUrl: './search.css',
})
export class Search implements OnInit {
  fields: any[] = [];
  filter: any = {};

  constructor(
    @Optional() private dialogRef: MatDialogRef<Search>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit() {
    if (this.data) {
      this.fields = this.data.fields || [];

      this.filter = { ...this.data.filter };
    }
  }

  submitSearch() {
    this.dialogRef.close({ filter: this.filter, isCleared: false });
  }

  clearFilter() {
    Object.keys(this.filter).forEach((key) => {
      this.filter[key] = '';
    });

    if (this.data?.storageKey) {
      localStorage.removeItem(this.data.storageKey);
    }

    this.dialogRef.close({
      filter: this.filter,
      isCleared: true,
    });
  }
  closeDialog() {
    this.dialogRef.close();
  }
}
