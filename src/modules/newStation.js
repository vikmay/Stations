import { baseUrl } from "../utils/configURL";

export function openNewStationModal(closeNewStationBtn) {
    const modal = document.getElementById('modal');
    const inputElement = document.getElementById('address');
    modal.style.display = 'block';
    inputElement.focus();
    // Close modal window button
    closeNewStationBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        inputElement.value = '';
    });
}

export function handleNewStationFormSubmission(stationData, getStations) {
    const newStationForm = document.getElementById('new-station-form');
    newStationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(newStationForm);
        const address = formData.get('address');
        const status = formData.get('status') === 'true';

        // Add new station to stationData
        const newStationData = {
            address: address,
            status: status
        };
        fetch(`${baseUrl}/stations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newStationData)
        })
            .then(response => {
                console.log(newStationData);
                if (!response.ok) {
                    throw new Error('Failed to add new station');
                }
                // Close the modal
                const modal = document.getElementById('modal');
                modal.style.display = 'none';
            })
            .then(() => getStations(stationData))
            .catch(error => {
                console.error('Error adding new station:', error);
            });
    });
}