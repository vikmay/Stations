import './style.css';
import { baseUrl } from './utils/configURL.js';
import { handleSearchInput } from './modules/search.js';
import { handleGetMetrics, updateMetrics } from './modules/metrics.js';
import { filterStations } from './modules/filter.js';
import { editStation } from './modules/editStation.js';
import { changeStationStatus } from './modules/changeStatus.js';
import { openNewStationModal, handleNewStationFormSubmission } from './modules/newStation.js';
import { handleEditModalClick } from './utils/closeModal.js';
import { renderStations } from './utils/renderStations.js';
import { handleDeleteButtonClick } from './modules/deleteStation.js';
import { handleStationFilterClick } from './utils/tabFilter.js';

const listContainer = document.querySelector('#station-list');
const btnAllStations = document.querySelector('#all-stations');
const btnActiveStations = document.querySelector('#btn-active-stations');
const btnNotActiveStations = document.querySelector('#btn-not-active-stations');
const newStationBtn = document.querySelector('#new-station');
const closeNewStationBtn = document.querySelector('#new-station-input-close');
const messageElement = document.querySelector('.message');

let stationData = [];
let currentFilter = 'all';

// Get stations from API
function getStations() {
    fetch(`${baseUrl}/stations`)
        .then((res) => res.json())
        .then((data) => {
            stationData = data;
            renderStations(stationData);
            handleSearchInput(currentFilter, btnActiveStations, btnNotActiveStations, btnAllStations,
                filterStations, renderStations, stationData);
        });
}

// Tab filter
btnAllStations.addEventListener('click', () => handleStationFilterClick('all',
    btnAllStations, btnActiveStations, btnNotActiveStations, stationData));
btnActiveStations.addEventListener('click', () => handleStationFilterClick('active',
    btnAllStations, btnActiveStations, btnNotActiveStations, stationData));
btnNotActiveStations.addEventListener('click', () => handleStationFilterClick('inactive',
    btnAllStations, btnActiveStations, btnNotActiveStations, stationData,));

// Create new station
newStationBtn.addEventListener('click', () => openNewStationModal(closeNewStationBtn));
handleNewStationFormSubmission(stationData, getStations);

// Delete station
listContainer.addEventListener('click', (event) => {
    if (event.target.id === 'delete-btn') {
        event.preventDefault();
        const stationId = event.target.dataset.id;
        handleDeleteButtonClick(event, messageElement, stationData,
            currentFilter, getStations, btnAllStations, btnActiveStations, btnNotActiveStations);
    }
});

// Change status
listContainer.addEventListener('click', (event) => {
    event.preventDefault();
    if (event.target.id === 'change-status-btn') {
        const stationId = event.target.dataset.id;
        changeStationStatus(stationId, stationData, currentFilter, renderStations);
    }
});

// Edit station
listContainer.addEventListener('click', (event) => {
    event.preventDefault();
    if (event.target.id === 'edit-station') {
        const stationId = event.target.dataset.id;
        editStation(stationId, stationData, currentFilter, btnActiveStations, btnNotActiveStations, btnAllStations, renderStations);
    }
});

// Close modal
addEventListener('click', handleEditModalClick);
// Get metrics
handleGetMetrics(currentFilter, updateMetrics);
// Get stations
getStations();