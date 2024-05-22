import { renderStations } from './renderStations.js';

export function handleStationFilterClick(filter, btnAllStations, btnActiveStations, btnNotActiveStations, stationData) {
    btnAllStations.classList.remove('active-tab');
    btnActiveStations.classList.remove('active-tab');
    btnNotActiveStations.classList.remove('active-tab');

    let filteredStations;
    switch (filter) {
        case 'all':
            btnAllStations.classList.add('active-tab');
            filteredStations = stationData;
            break;
        case 'active':
            btnActiveStations.classList.add('active-tab');
            filteredStations = stationData.filter(station => station.status);
            break;
        case 'inactive':
            btnNotActiveStations.classList.add('active-tab');
            filteredStations = stationData.filter(station => !station.status);
            break;
    }
    renderStations(filteredStations);
    return filter;
}