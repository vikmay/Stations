import { Component, Input, OnInit } from '@angular/core';
import { StationService } from '../../services/station.service';
import { TemperatureRadiationData } from '../../models/station.model';

@Component({
  selector: 'app-station-table',
  templateUrl: './station-table.component.html',
  styleUrls: ['./station-table.component.scss'],
})
export class StationTableComponent implements OnInit {
  @Input() stationId!: number;
  data: TemperatureRadiationData[] = [];

  constructor(private stationService: StationService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.stationService
      .getTemperatureRadiationData(this.stationId)
      .subscribe((data) => {
        this.data = data;
      });
  }
}
