import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Client, CreatePersonCommand, PersonAstronautDto, UpdatePersonCommand } from '../../api/stargate-api-client';
import { finalize } from 'rxjs';
import { PersonDialogComponent } from '../../components/person-dialog/person-dialog.component';
import { MaterialModule } from '../../shared/material.module';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-people-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule
  ],
  templateUrl: './people-list.component.html',
  styleUrl: './people-list.component.scss'
})
export class PeopleListComponent implements OnInit {
  dataSource = new MatTableDataSource<PersonAstronautDto>([]);
  displayedColumns = ['id', 'name', 'currentRank', 'currentDutyTitle', 'careerStartDate', 'careerEndDate', 'actions'];

  filterName = '';
  sortColumn = 'id';
  sortDirection = 'asc';

  pageIndex = 0;
  pageSize = 5;
  totalItems = 0;

  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private api: Client, private dialog: MatDialog) {}

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
      this.dataSource.data = response.data ?? [];
      this.totalItems = response.totalItems ?? 0;
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

  openAddDialog() {
    const dialogRef = this.dialog.open(PersonDialogComponent, {
      width: '400px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const createPerson = new CreatePersonCommand();
        createPerson.name = result.name;

        if (result.isAstronaut) {
          createPerson.currentRank = result.rank;
          createPerson.currentDutyTitle = result.title;
          createPerson.careerStartDate = result.startDate ? new Date(result.startDate) : undefined;
          createPerson.careerEndDate = result.endDate ? new Date(result.endDate) : undefined;
        }

        this.api.personPOST(createPerson)
          .pipe(finalize(() => this.loadData()))
          .subscribe();
      }
    });
  }

  openEditDialog(person: PersonAstronautDto) {
    const dialogRef = this.dialog.open(PersonDialogComponent, {
      width: '400px',
      data: { isEdit: true, person }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatePerson = new UpdatePersonCommand();
        updatePerson.name = result.name;

        if (result.isAstronaut) {
          updatePerson.currentRank = result.rank;
          updatePerson.currentDutyTitle = result.title;
          updatePerson.careerStartDate = result.startDate ? new Date(result.startDate) : undefined;
          updatePerson.careerEndDate = result.endDate ? new Date(result.endDate) : undefined;
        }

        this.api.personPUT(person.id!, updatePerson)
          .pipe(finalize(() => this.loadData()))
          .subscribe();
      }
    });
  }
}
