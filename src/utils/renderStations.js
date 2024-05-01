import { displayStationsContainer } from './displayStationContainer.js';

export function renderStations(data, listContainer) {
  listContainer = document.querySelector('#station-list');
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
  // Do not display stations container's borders if no stations are present
  displayStationsContainer(listContainer);
}