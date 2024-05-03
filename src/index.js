import './style.scss';
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
    return fetch(`${baseUrl}/stations`)
        .then((res) => res.json())
        .then((data) => {
            stationData = data;
            handleSearchInput(currentFilter, btnActiveStations, btnNotActiveStations, btnAllStations,
                filterStations, renderStations, stationData);
            return stationData;
        });
}

//Render stations on page load
document.addEventListener('DOMContentLoaded', function () {
    getStations()
        .then((stationData) => {
            renderStations(stationData);
        })
        .catch(error => console.error('Error fetching stations:', error));
});

// Tab filter
function addTabClickListener(button, filter) {
    button.addEventListener('click', () => {
        // handleStationFilterClick(filter, btnAllStations, btnActiveStations, btnNotActiveStations, stationData,);
        currentFilter = handleStationFilterClick(filter, btnAllStations, btnActiveStations, btnNotActiveStations, stationData);
    });
}
addTabClickListener(btnAllStations, 'all');
addTabClickListener(btnActiveStations, 'active');
addTabClickListener(btnNotActiveStations, 'inactive');

// Create new station
newStationBtn.addEventListener('click', () => openNewStationModal(closeNewStationBtn));
handleNewStationFormSubmission(() => {
    getStations()
        .then((stationData) => {
            renderStations(stationData);
        })
        .catch(error => console.error('Error fetching stations:', error));
});

// Delete station
listContainer.addEventListener('click', (event) => {
    if (event.target.id === 'delete-btn') {
        event.preventDefault();
        handleDeleteButtonClick(event, messageElement, stationData,
            currentFilter, getStations, btnAllStations, btnActiveStations, btnNotActiveStations);

    }
});

// Change status
listContainer.addEventListener('click', (event) => {
    event.preventDefault();
    if (event.target.id === 'change-status-btn') {
        const stationId = event.target.dataset.id;
        changeStationStatus(stationId, stationData, currentFilter, renderStations, btnActiveStations, btnNotActiveStations, btnAllStations);

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