import { baseUrl } from "../utils/configURL";
import { handleStationFilterClick } from "../utils/tabFilter";

export async function changeStationStatus(
    stationId,
    stationData,
    currentFilter,
    renderStations,
    btnActiveStations,
    btnNotActiveStations,
    btnAllStations
) {
    console.log('change status function called');
    const station = stationData.find(station => station.id === parseInt(stationId));
    if (!station) {
        console.error(`Station with ID ${stationId} not found`);
        return;
    }

    try {
        const response = await fetch(`${baseUrl}/stations/${stationId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: !station.status
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update status');
        }

        const updatedStation = await response.json();
        station.status = updatedStation.status;

        // Re-render stations according to the current filter
        handleStationFilterClick(
            currentFilter,
            btnAllStations,
            btnActiveStations,
            btnNotActiveStations,
            stationData
        );

    } catch (error) {
        console.error('Error changing status:', error);
    }
}