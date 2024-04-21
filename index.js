const listContainer = document.querySelector('#station-list');
const btnAllStations = document.querySelector('#all-stations');
const btnActiveStations = document.querySelector('#btn-active-stations');
const btnNotActiveStations = document.querySelector('#btn-not-active-stations');
const btnDelete = document.querySelector('.delete-btn');
const btnEdit = document.querySelector('.edit-btn');
const newStationBtn = document.querySelector('#new-station');
const closeModalBtn = document.querySelector('.close');

let stationData = [];
let currentFilter = 'all';

function getStations() {
    fetch('http://localhost:3000/stations')
        .then((res) => res.json())
        .then((data) => {
            stationData = data;
            renderStations(stationData);
        });
}

function renderStations(data) {
    listContainer.innerHTML = '';
    data.forEach((station) => {
        listContainer.innerHTML += `
     <li id="station-${station.id}" >
        <div class="station-container" >
          <div id="station-status" class="${station.status === true ? 'station-active' : 'station-inactive'}"></div>
          <b>Station ${station.id}</b> ${station.address}
          <div class="btn-container">
            <button class="station-btn" id="edit-station" title="Edit" data-id="${station.id}">Edit</button>
            <button class="station-btn" id="change-status-btn" title="Change Status" data-id="${station.id}">Change Status</button>
            <button class="station-btn" id="delete-btn" title="Remove" data-id="${station.id}">Remove</button>
          </div>
        </div>
     </li><hr>`;
    });
}

// Tab active all stations
btnAllStations.addEventListener('click', () => {
    btnAllStations.classList.add('active-tab');
    btnActiveStations.classList.remove('active-tab');
    btnNotActiveStations.classList.remove('active-tab');
    currentFilter = 'all'; // Update current filter state
    getStations(); // Reapply filter
});

// Filter active stations
btnActiveStations.addEventListener('click', () => {
    btnActiveStations.classList.add('active-tab');
    btnAllStations.classList.remove('active-tab');
    btnNotActiveStations.classList.remove('active-tab');
    currentFilter = 'active'; // Update current filter state

    const activeStations = stationData.filter(station => station.status);
    renderStations(activeStations);
});

// Filter inactive stations
btnNotActiveStations.addEventListener('click', () => {
    btnNotActiveStations.classList.add('active-tab');
    btnActiveStations.classList.remove('active-tab');
    btnAllStations.classList.remove('active-tab');
    currentFilter = 'inactive'; // Update current filter state

    const inactiveStations = stationData.filter(station => !station.status);
    renderStations(inactiveStations);
});

// Close modal button event listener
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// New station button event listener
newStationBtn.addEventListener('click', () => {
    // Get the modal element
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
});

// New Station Form
const newStationForm = document.getElementById('new-station-form');
newStationForm.addEventListener('submit', (event) => {
    const formData = new FormData(newStationForm);
    const address = formData.get('address');
    const status = formData.get('status') === 'true';

    const newStationData = {
        address: address,
        status: status
    };

    // Send request to add new station
    fetch('http://localhost:3000/stations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newStationData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add new station');
            }
            // Close the modal
            const modal = document.getElementById('modal');
            modal.style.display = 'none';
            // Refresh the stations list
            getStations();
        })
        .catch(error => {
            console.error('Error adding new station:', error);
        });
});

// Delete station event listener
listContainer.addEventListener('click', (event) => {
    if (event.target.id === 'delete-btn') {
        event.preventDefault();
        const stationId = event.target.dataset.id;

        fetch(`http://localhost:3000/stations/${stationId}`, {
            method: 'DELETE'
        })
            .then(() => {

                stationData = stationData.filter(station => station.id !== parseInt(stationId));

                renderStations(stationData);
            })
            .then(() => {
                // Reapply the current filter
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

// Change status button event listener
listContainer.addEventListener('click', (event) => {
    if (event.target.id === 'change-status-btn') {

        const stationId = event.target.dataset.id;
        const station = stationData.find(station => station.id === parseInt(stationId));

        fetch(`http://localhost:3000/stations/${stationId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: !station.status
            })
        })
            .then(() => {
                // Update station status in the data array
                station.status = !station.status;
                // Render stations based on the current filter
                if (currentFilter === 'active') {
                    const activeStations = stationData.filter(station => station.status);
                    renderStations(activeStations);
                } else if (currentFilter === 'inactive') {
                    const inactiveStations = stationData.filter(station => !station.status);
                    renderStations(inactiveStations);
                } else {
                    // Default: render all stations
                    renderStations(stationData);
                }
            })
            .catch((error) => {
                console.error('Error changing status:', error);
            });
    }
});

// Edit station event listener
listContainer.addEventListener('click', function editStationHandler(event) {
    event.preventDefault();
    if (event.target.id === 'edit-station') {
        const stationId = event.target.dataset.id;
        const station = stationData.find(station => station.id === parseInt(stationId));
        const li = document.getElementById(`station-${stationId}`);
        const existingForm = document.querySelector(`#form-${stationId}`);
        if (!existingForm) {
            // Remove other edit forms if present
            document.querySelectorAll('.edit-station-form').forEach(form => form.remove());

            li.innerHTML += `
                <form id="form-${stationId}" class="edit-station-form">
                    <input type="text" id="address-${stationId}" value="${station.address}">
                    <button id="btn-apply-${stationId}" data-id="${station.id}">Apply</button>
                    <span onclick="closeEditForm()" style="color: red;font-size: 24px;font-weight: 600;" class="close">&times;</span>
                </form>`;
        }

        const addressInput = document.getElementById(`address-${stationId}`);
        addressInput.value = station.address;

        // Add event listener to the "Apply" button
        const applyBtn = document.getElementById(`btn-apply-${stationId}`);
        applyBtn.addEventListener('click', () => {
            const newAddress = addressInput.value;

            // Update station address
            station.address = newAddress;

            // Send request to update station data
            fetch(`http://localhost:3000/stations/${stationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    address: newAddress
                })
            })
                .then(() => {
                    renderStations(stationData);
                })
                .then(() => {
                    // Reapply the current filter
                    if (currentFilter === 'active') {
                        btnActiveStations.click();

                    } else if (currentFilter === 'inactive') {
                        btnNotActiveStations.click();
                        event.preventDefault();

                    } else {
                        btnAllStations.click();
                    }
                })


                .catch((error) => {
                    console.error('Error updating station:', error);
                });
        });
    }
});

// Close edit form on click
function closeEditForm() {
    const editForm = document.querySelector('.edit-station-form');
    if (editForm) {
        editForm.remove();
    }
}

// Function to filter stations based on search query
function filterStations(query) {
    const filteredStations = stationData.filter(station => {
        // Match the query
        const addressMatch = station.address.toLowerCase().includes(query.toLowerCase());
        const idMatch = station.id.toString().includes(query.toLowerCase());
        const nameMatch = "Station".toLowerCase().includes(query.toLowerCase());
        const nameIdMatch = `Station ${station.id}`.toLowerCase().includes(query.toLowerCase())
        return addressMatch || idMatch || nameMatch || nameIdMatch;
    });
    renderStations(filteredStations);
}

// Event listener for search input field
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', () => {
    const searchQuery = searchInput.value.trim(); // Trim leading and trailing whitespace
    if (searchQuery === '') {
        // If search query is empty, show all stations based on current filter
        if (currentFilter === 'active') {
            btnActiveStations.click();
        } else if (currentFilter === 'inactive') {
            btnNotActiveStations.click();

        } else {
            btnAllStations.click();
        }
    } else {
        // If search query is not empty, filter stations based on the query
        filterStations(searchQuery);
    }
});

getStations();

