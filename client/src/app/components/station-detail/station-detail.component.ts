import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StationService } from '../../services/station.service';
import { Station } from '../../models/station.model';

@Component({
  selector: 'app-station-detail',
  templateUrl: './station-detail.component.html',
  styleUrls: ['./station-detail.component.scss'],
})
export class StationDetailComponent implements OnInit {
  station: Station | null = null; // Initialize as null to handle *ngIf

  constructor(
    private route: ActivatedRoute,
    private stationService: StationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.stationService.getStation(Number(id)).subscribe((station) => {
        this.station = station;
      });
    }
  }

  navigateToEdit(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigate([`/edit-station/${id}`]);
    }
  }
}
