import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StationListComponent } from './components/station-list/station-list.component';
import { StationDetailComponent } from './components/station-detail/station-detail.component';
import { StationFormComponent } from './components/station-form/station-form.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/stations', pathMatch: 'full' },
  { path: 'stations', component: StationListComponent },
  { path: 'stations/:id', component: StationDetailComponent },
  { path: 'create-station', component: StationFormComponent },
  { path: 'edit-station/:id', component: StationFormComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
