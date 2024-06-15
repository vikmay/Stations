import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StationService } from '../../services/station.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-station-form',
  templateUrl: './station-form.component.html',
  styleUrls: ['./station-form.component.scss'],
})
export class StationFormComponent implements OnInit {
  stationForm: FormGroup;
  isEditMode = false;
  stationId: number | null = null; // Store the station ID

  constructor(
    private fb: FormBuilder,
    private stationService: StationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.stationForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      status: [false, Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.stationId = Number(id); // Store the station ID
      this.stationService.getStation(this.stationId).subscribe((station) => {
        this.stationForm.patchValue(station);
      });
    }
  }

  onSubmit(): void {
    if (this.stationForm.valid) {
      const stationData = this.stationForm.value;
      if (this.isEditMode && this.stationId !== null) {
        this.stationService
          .updateStation(this.stationId, stationData)
          .subscribe(() => {
            this.router.navigate(['/stations']);
          });
      } else {
        this.stationService.createStation(stationData).subscribe(() => {
          this.router.navigate(['/stations']);
        });
      }
    }
  }
}
