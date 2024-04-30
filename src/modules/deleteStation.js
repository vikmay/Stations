import { baseUrl } from "../utils/configURL";

export function handleDeleteButtonClick(event, messageElement, stationData, currentFilter,
    getStations, btnAllStations, btnActiveStations, btnNotActiveStations) {


    if (event.target.id === 'delete-btn') {
        event.preventDefault();
        const stationId = event.target.dataset.id;

        fetch(`${baseUrl}/stations/${stationId}`, {
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
                console.log('Station deleted,CurrentFilter =', currentFilter);
                getStations(stationData);
                if (currentFilter === 'active') {
                    btnActiveStations.click();
                    event.preventDefault();
                } else if (currentFilter === 'inactive') {
                    btnNotActiveStations.click();
                    event.preventDefault();
                } else {
                    btnAllStations.click();
                    event.preventDefault();
                }
            })
            .catch((error) => {
                console.error('Error deleting station:', error);
            });
    }
}