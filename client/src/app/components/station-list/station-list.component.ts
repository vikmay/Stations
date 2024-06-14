import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StationService } from '../../services/station.service';
import { Station } from '../../models/station.model';

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.scss'],
})
export class StationListComponent implements OnInit {
  stations: Station[] = [];

  constructor(private stationService: StationService, private router: Router) {}

  ngOnInit(): void {
    this.loadStations();
  }

  loadStations(): void {
    this.stationService.getStations().subscribe((stations) => {
      this.stations = stations;
    });
  }

  deleteStation(id: number): void {
    this.stationService.deleteStation(id).subscribe(() => {
      this.loadStations();
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['/create-station']);
  }

  viewStation(id: number): void {
    this.router.navigate([`/stations/${id}`]);
  }

  sort(column: string): void {
    // Implement sorting logic here
  }
}
