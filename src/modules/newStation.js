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

export function handleNewStationFormSubmission(getStationsCallback) {
    const newStationForm = document.getElementById('new-station-form');
    newStationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(newStationForm);
        const address = formData.get('address');
        const status = formData.get('status') === 'true';

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
                if (!response.ok) {
                    throw new Error('Failed to add new station');
                }
                // Close the modal
                const modal = document.getElementById('modal');
                modal.style.display = 'none';
                return response.json();
            })
            .then(() => {
                return getStationsCallback();
            })
            .catch(error => {
                console.error('Error adding new station:', error);
            });
    });
}