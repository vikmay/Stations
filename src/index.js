import './style.css';
import { handleSearchInput } from './modules/search.js';
import { handleGetMetrics, updateMetrics } from './modules/metrics.js';
import { filterStations } from './modules/filter.js';
import { editStation } from './modules/editStation.js';
import { changeStationStatus } from './modules/changeStatus.js';
import { openNewStationModal, handleNewStationFormSubmission } from './modules/newStation.js';
import { handleEditModalClick } from './utils/closeModal.js';
import { renderStations } from './utils/renderStations.js';

const listContainer = document.querySelector('#station-list');
const btnAllStations = document.querySelector('#all-stations');
const btnActiveStations = document.querySelector('#btn-active-stations');
const btnNotActiveStations = document.querySelector('#btn-not-active-stations');
const newStationBtn = document.querySelector('#new-station');
const closeNewStationBtn = document.querySelector('#new-station-input-close');
const messageElement = document.querySelector('.message');

let stationData = [];
let currentFilter = 'all';

// // Get stations from API
function getStations() {
    fetch('http://localhost:3000/stations')
        .then((res) => res.json())
        .then((data) => {
            stationData = data;
            renderStations(stationData);
            handleSearchInput(currentFilter, btnActiveStations, btnNotActiveStations, btnAllStations, filterStations, renderStations, stationData);
        });
}

// Show all stations
btnAllStations.addEventListener('click', () => {
    btnAllStations.classList.add('active-tab');
    btnActiveStations.classList.remove('active-tab');
    btnNotActiveStations.classList.remove('active-tab');
    currentFilter = 'all';
    renderStations(stationData);
});

// Show active stations
btnActiveStations.addEventListener('click', () => {
    btnActiveStations.classList.add('active-tab');
    btnAllStations.classList.remove('active-tab');
    btnNotActiveStations.classList.remove('active-tab');
    currentFilter = 'active';
    const activeStations = stationData.filter(station => station.status);
    renderStations(activeStations);
});

// Show inactive stations
btnNotActiveStations.addEventListener('click', () => {
    btnNotActiveStations.classList.add('active-tab');
    btnActiveStations.classList.remove('active-tab');
    btnAllStations.classList.remove('active-tab');
    currentFilter = 'inactive';
    const inactiveStations = stationData.filter(station => !station.status);
    renderStations(inactiveStations);
});

// Create new station
newStationBtn.addEventListener('click', () => openNewStationModal(closeNewStationBtn));
handleNewStationFormSubmission('click', () => renderStations(stationData));

//Delete station
listContainer.addEventListener('click', (event) => {

    if (event.target.id === 'delete-btn') {
        event.preventDefault();
        const stationId = event.target.dataset.id;

        fetch(`http://localhost:3000/stations/${stationId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    return response.text(); // Extract the response text
                } else {
                    throw new Error('Error deleting station: ' + response.status);
                }
            })
            .then(message => {
                messageElement.textContent = message;

                setTimeout(() => {
                    messageElement.style.opacity = '0';
                    setTimeout(() => {
                        messageElement.textContent = '';
                    }, 1000)
                }, 3000);
                messageElement.style.opacity = '1';

                stationData = stationData.filter(station => station.id !== parseInt(stationId));
                renderStations(stationData);
                if (currentFilter === 'active') {
                    btnActiveStations.click();
                } else if (currentFilter === 'inactive') {
                    btnNotActiveStations.click();
                } else {
                    btnAllStations.click();
                }
            })
            .catch((error) => {
                console.error('Error deleting station:', error);
            });
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