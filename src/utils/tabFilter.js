import { renderStations } from '../utils/renderStations.js';

export function handleStationFilterClick(filter, btnAllStations, btnActiveStations, btnNotActiveStations, stationData) {
    // Remove active class from all buttons
    btnAllStations.classList.remove('active-tab');
    btnActiveStations.classList.remove('active-tab');
    btnNotActiveStations.classList.remove('active-tab');

    // Handle filtering
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