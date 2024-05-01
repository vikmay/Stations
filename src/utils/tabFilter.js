import { renderStations } from '../utils/renderStations.js';

export function handleStationFilterClick(filter, btnAllStations, btnActiveStations, btnNotActiveStations, stationData, currentFilter) {
    // Remove active class from all buttons
    btnAllStations.classList.remove('active-tab');
    btnActiveStations.classList.remove('active-tab');
    btnNotActiveStations.classList.remove('active-tab');

    // Add active class to the clicked button
    switch (filter) {
        case 'all':
            btnAllStations.classList.add('active-tab');
            break;
        case 'active':
            btnActiveStations.classList.add('active-tab');
            break;
        case 'inactive':
            btnNotActiveStations.classList.add('active-tab');
            break;
    }

    // Update current filter
    currentFilter = filter;

    // Filter stations based on current filter
    let filteredStations;
    switch (filter) {
        case 'all':
            filteredStations = stationData;
            break;
        case 'active':
            filteredStations = stationData.filter(station => station.status);
            break;
        case 'inactive':
            filteredStations = stationData.filter(station => !station.status);
            break;
    }
    // Render filtered stations
    renderStations(filteredStations);
}