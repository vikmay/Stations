import { baseUrl } from "../utils/configURL";
import { handleStationFilterClick } from "../utils/tabFilter";

export function changeStationStatus(stationId, stationData, currentFilter, renderStations, btnActiveStations, btnNotActiveStations, btnAllStations) {
    const station = stationData.find(station => station.id === parseInt(stationId));
    fetch(`${baseUrl}/stations/${stationId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: !station.status
        })
    })
        //render according to current filter

        .then(() => {

            station.status = !station.status;
            handleStationFilterClick(currentFilter, btnAllStations, btnActiveStations, btnNotActiveStations, stationData);
        })
        .catch((error) => {
            console.error('Error changing status:', error);
        });
}


