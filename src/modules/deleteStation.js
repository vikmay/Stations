import { baseUrl } from "../utils/configURL";
import { handleStationFilterClick } from "../utils/tabFilter";

export async function handleDeleteButtonClick(event, messageElement, stationData, currentFilter,
    getStations, btnAllStations, btnActiveStations, btnNotActiveStations) {

    const stationId = event.target.dataset.id;
    if (event.target.id === `delete-btn${stationId}`) {
        event.preventDefault();

        try {
            const response = await fetch(`${baseUrl}/stations/${stationId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Error deleting station: ' + response.status);
            }

            messageElement.textContent = `Station ${stationId} deleted successfully!`;

            setTimeout(() => {
                messageElement.style.opacity = '0';
                setTimeout(() => {
                    messageElement.textContent = '';
                }, 1000);
            }, 3000);

            messageElement.style.opacity = '1';

            stationData = stationData.filter(station => station.id !== parseInt(stationId));
            handleStationFilterClick(currentFilter, btnAllStations, btnActiveStations, btnNotActiveStations, stationData);
            await getStations();
        } catch (error) {
            console.error('Error deleting station:', error);
        }
    }
}