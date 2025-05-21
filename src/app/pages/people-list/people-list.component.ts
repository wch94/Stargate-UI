import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Client, GetPeopleResponse } from '../../api/stargate-api-client';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-people-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule 
  ],
  templateUrl: './people-list.component.html',
  styleUrl: './people-list.component.scss'
})
export class PeopleListComponent implements OnInit {
  data: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'currentRank', 'currentDutyTitle'];

  filterName = '';
  sortColumn = 'name';
  sortDirection = 'asc';

  pageIndex = 0;
  pageSize = 10;
  totalItems = 0;

  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private api: Client) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
  this.loading = true;
    this.api.personGET(
      this.filterName || undefined,
      this.sortColumn,
      this.sortDirection === 'desc',
      this.pageIndex + 1,  // API uses 1-based indexing
      this.pageSize
    )
    .pipe(finalize(() => this.loading = false))
    .subscribe(response => {
      const typed = response as unknown as GetPeopleResponse;
      this.data = typed.data ?? [];
      this.totalItems = typed.totalItems ?? 0;
    });
  }

  applyFilter(): void {
    this.pageIndex = 0;
    this.loadData();
  }

  pageChanged(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  sortChanged(sort: Sort): void {
    this.sortColumn = sort.active;
    this.sortDirection = sort.direction || 'asc';
    this.loadData();
  }
}
