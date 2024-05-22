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
import { countStations, updateCounter } from './modules/counter.js';

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
async function getStations() {
    try {
        const res = await fetch(`${baseUrl}/stations`);
        const data = await res.json();
        stationData = data;
        handleSearchInput(currentFilter, btnActiveStations, btnNotActiveStations, btnAllStations,
            filterStations, renderStations, stationData);
        return stationData;
    } catch (error) {
        console.error('Error fetching stations:', error);
        return [];
    }
}

// UpdateCounter on DOMContentLoaded
document.addEventListener('DOMContentLoaded', async () => {
    await updateCounter(getStations);
});

//Render stations on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const stations = await getStations();
        renderStations(stations);
    } catch (error) {
        console.error('Error fetching stations:', error);
    }
});

// Tab filter
function addTabClickListener(button, filter) {
    button.addEventListener('click', () => {
        currentFilter = handleStationFilterClick(filter, btnAllStations, btnActiveStations, btnNotActiveStations, stationData);
    });
}
addTabClickListener(btnAllStations, 'all');
addTabClickListener(btnActiveStations, 'active');
addTabClickListener(btnNotActiveStations, 'inactive');

// Create new station
newStationBtn.addEventListener('click', () => openNewStationModal(closeNewStationBtn));
handleNewStationFormSubmission(async () => {
    try {
        const stations = await getStations();
        renderStations(stations);
        await updateCounter(getStations);
    } catch (error) {
        console.error('Error fetching stations:', error);
    }
});

// Delete station
listContainer.addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-btn')) {
        event.preventDefault();
        await handleDeleteButtonClick(event, messageElement, stationData,
            currentFilter, getStations, btnAllStations, btnActiveStations, btnNotActiveStations);
        countStations(getStations);
        updateCounter(getStations);
    }
});

// Change status
listContainer.addEventListener('click', async (event) => {
    event.preventDefault();
    if (event.target.classList.contains('change-status')) {
        const stationId = event.target.dataset.id;
        await changeStationStatus(stationId, stationData, currentFilter, renderStations, btnActiveStations, btnNotActiveStations, btnAllStations);
        await updateCounter(getStations);
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