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

  constructor(
    private fb: FormBuilder,
    private stationService: StationService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.stationForm = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.stationService.getStation(Number(id)).subscribe((station) => {
        this.stationForm.patchValue(station);
      });
    }
  }

  onSubmit(): void {
    if (this.stationForm.valid) {
      if (this.isEditMode) {
        this.stationService
          .updateStation(this.stationForm.value)
          .subscribe(() => {
            this.router.navigate(['/stations']);
          });
      } else {
        this.stationService
          .createStation(this.stationForm.value)
          .subscribe(() => {
            this.router.navigate(['/stations']);
          });
      }
    }
  }
}
