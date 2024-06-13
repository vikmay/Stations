import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Station, TemperatureRadiationData } from '../models/station.model';

@Injectable({
  providedIn: 'root',
})
export class StationService {
  private apiUrl = 'http://localhost:3000/stations';

  constructor(private http: HttpClient) {}

  getStations(): Observable<Station[]> {
    return this.http.get<Station[]>(this.apiUrl);
  }

  getStation(id: number): Observable<Station> {
    return this.http.get<Station>(`${this.apiUrl}/${id}`);
  }

  createStation(station: Station): Observable<Station> {
    return this.http.post<Station>(this.apiUrl, station);
  }

  updateStation(station: Station): Observable<Station> {
    return this.http.put<Station>(`${this.apiUrl}/${station.id}`, station);
  }

  deleteStation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTemperatureRadiationData(
    stationId: number
  ): Observable<TemperatureRadiationData[]> {
    return this.http.get<TemperatureRadiationData[]>(
      `${this.apiUrl}/${stationId}/data`
    );
  }
}
