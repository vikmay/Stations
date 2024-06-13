import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StationListComponent } from '../components/station-list/station-list.component';
import { StationDetailComponent } from '../components/station-detail/station-detail.component';
import { StationFormComponent } from '../components/station-form/station-form.component';
import { StationTableComponent } from '../components/station-table/station-table.component';

@NgModule({
  declarations: [
    StationListComponent,
    StationDetailComponent,
    StationFormComponent,
    StationTableComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  exports: [
    StationListComponent,
    StationDetailComponent,
    StationFormComponent,
    StationTableComponent,
  ],
})
export class StationModule {}
