export interface Station {
  id: number;
  name: string;
  address: string;
  status: string;
}

export interface TemperatureRadiationData {
  date: string;
  temperature: number;
  radiation: number;
}
