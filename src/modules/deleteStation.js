import { baseUrl } from "../utils/configURL";
import { handleStationFilterClick } from "../utils/tabFilter";

export function handleDeleteButtonClick(event, messageElement, stationData, currentFilter,
    getStations, btnAllStations, btnActiveStations, btnNotActiveStations) {

    const stationId = event.target.dataset.id;
    if (event.target.id == `delete-btn${stationId}`) {
        event.preventDefault();

        fetch(`${baseUrl}/stations/${stationId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    return response.text();
                } else {
                    throw new Error('Error deleting station: ' + response.status);
                }
            })
            .then(message => {
                messageElement.textContent = `Station ${stationId} deleted successfully!`;

                setTimeout(() => {
                    messageElement.style.opacity = '0';
                    setTimeout(() => {
                        messageElement.textContent = '';
                    }, 1000)
                }, 3000);

                messageElement.style.opacity = '1';
                stationData = stationData.filter(station => station.id !== parseInt(stationId));
                getStations(stationData);
                //render according to current filter
                handleStationFilterClick(currentFilter, btnAllStations, btnActiveStations, btnNotActiveStations, stationData);
            })

            .catch((error) => {
                console.error('Error deleting station:', error);
            });
    }
}