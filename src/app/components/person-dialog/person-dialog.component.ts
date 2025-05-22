import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PersonAstronautDto } from '../../api/stargate-api-client';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material.module';

export interface PersonDialogData {
  isEdit: boolean;
  person?: PersonAstronautDto; 
}

@Component({
  selector: 'app-person-dialog',
  templateUrl: './person-dialog.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule
  ],
})
export class PersonDialogComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PersonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PersonDialogData
  ) {}

  ngOnInit(): void {
    const person = this.data.person;

    this.form = this.fb.group({
      name: [person?.name || '', Validators.required],
      isAstronaut: [!!person?.isAstronaut],
      rank: [{ value: person?.currentRank || '', disabled: !person?.isAstronaut }],
      title: [{ value: person?.currentDutyTitle || '', disabled: !person?.isAstronaut }],
      startDate: [{ 
        value: person?.careerStartDate 
          ? new Date(person.careerStartDate).toISOString().substring(0, 10) 
          : null, 
        disabled: !person?.isAstronaut
      }],
      endDate: [{ 
        value: person?.careerEndDate 
          ? new Date(person.careerEndDate).toISOString().substring(0, 10) 
          : null, 
        disabled: !person?.isAstronaut 
      }]
    });

    this.form.get('isAstronaut')!.valueChanges.subscribe((checked) => {
      const controls = ['rank', 'title', 'startDate', 'endDate'];
      controls.forEach(ctrl => {
        const control = this.form.get(ctrl);
        if (checked) control?.enable();
        else control?.disable();
      });
    });
  }

  save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.getRawValue());
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
