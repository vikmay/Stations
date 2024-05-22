import { baseUrl } from "../utils/configURL";

export function editStation(stationId, stationData, currentFilter, btnActiveStations, btnNotActiveStations, btnAllStations) {
    const station = stationData.find(station => station.id === parseInt(stationId));
    const li = document.getElementById(`station-${stationId}`);
    const existingForm = document.querySelector(`#form-${stationId}`);

    if (!existingForm) {
        document.querySelectorAll('.edit-station-form').forEach(form => form.remove());
        li.innerHTML += `
            <form id="form-${stationId}" class="edit-station-form">
                <input type="text" id="address-${stationId}" value="${station.address}">
                <button id="btn-apply-${stationId}" data-id="${station.id}">Apply</button>
                <button class="edit-close">&times;</button>
            </form>`;
    }

    const addressInput = document.getElementById(`address-${stationId}`);
    if (addressInput) {
        addressInput.value = station.address;

        const applyBtn = document.getElementById(`btn-apply-${stationId}`);
        applyBtn.addEventListener('click', () => {
            const newAddress = addressInput.value;
            station.address = newAddress;

            fetch(`${baseUrl}/stations/${stationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    address: newAddress
                })
            })

                .then((event) => {
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
    } else {
        console.error(`Address input not found for station ID ${stationId}`);
    }
}