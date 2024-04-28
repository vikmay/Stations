import './style.css';
import { handleSearchInput } from './search.js';
import { handleGetMetrics, updateMetrics } from './metrics.js';
import { filterStations } from './filter.js';
import { editStation } from './editStation.js';
import { changeStationStatus } from './changeStatus.js';
import { openNewStationModal, handleNewStationFormSubmission } from './newStation.js';

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
    fetch('http://localhost:3000/stations')
        .then((res) => res.json())
        .then((data) => {
            stationData = data;
            renderStations(stationData);
            handleSearchInput(currentFilter, btnActiveStations, btnNotActiveStations, btnAllStations, filterStations, renderStations, stationData);
        });
}

// Render stations in a list
function renderStations(data) {
    listContainer.innerHTML = '';
    data.forEach((station) => {
        listContainer.innerHTML += `
     <li id="station-${station.id}" >
        <div class="station-container" >
          <div id="station-status" class="${station.status === true ? 'station-active' : 'station-inactive'}"></div>
          <b>Station ${station.id}</b> ${station.address}
          <div class="btn-container">
            <button class="metrics-btn" id="get-metrics" title="Metrics" data-id="${station.id}">Info</button>
            <button class="station-btn" id="edit-station" title="Edit" data-id="${station.id}">Edit</button>
            <button class="station-btn" id="change-status-btn" title="Change Status" data-id="${station.id}">Change Status</button>
            <button class="station-btn" id="delete-btn" title="Remove" data-id="${station.id}">Remove</button>
          </div>
        </div>
     </li><hr>`;
    });
    displayStationsContainer();
}

// Do not display stations container's borders if no stations
function displayStationsContainer() {
    if (listContainer.innerHTML === '') {
        listContainer.style.display = 'none';
    } else {
        listContainer.style.display = 'block';
    }
}

// Tab active all stations
btnAllStations.addEventListener('click', () => {
    btnAllStations.classList.add('active-tab');
    btnActiveStations.classList.remove('active-tab');
    btnNotActiveStations.classList.remove('active-tab');
    currentFilter = 'all';
    renderStations(stationData);
});

// Filter active stations
btnActiveStations.addEventListener('click', () => {
    btnActiveStations.classList.add('active-tab');
    btnAllStations.classList.remove('active-tab');
    btnNotActiveStations.classList.remove('active-tab');
    currentFilter = 'active';
    const activeStations = stationData.filter(station => station.status);
    renderStations(activeStations);
});

// Filter inactive stations
btnNotActiveStations.addEventListener('click', () => {
    btnNotActiveStations.classList.add('active-tab');
    btnActiveStations.classList.remove('active-tab');
    btnAllStations.classList.remove('active-tab');
    currentFilter = 'inactive';
    const inactiveStations = stationData.filter(station => !station.status);
    renderStations(inactiveStations);
});

// Attach event listeners
newStationBtn.addEventListener('click', () => openNewStationModal(closeNewStationBtn));
handleNewStationFormSubmission(() => getStations());

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

handleGetMetrics(currentFilter, updateMetrics);
getStations();
