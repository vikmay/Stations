import { baseUrl } from "../utils/configURL";

export function changeStationStatus(stationId, stationData, currentFilter, renderStations) {
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
        .then(() => {
            station.status = !station.status;
            if (currentFilter === 'active') {
                console.log('active');
                const activeStations = stationData.filter(station => station.status);
                renderStations(activeStations);
            } else if (currentFilter === 'inactive') {
                console.log('inactive');
                const inactiveStations = stationData.filter(station => !station.status);
                renderStations(inactiveStations);
            } else {
                console.log('default');
                renderStations(stationData);
            }
        })
        .catch((error) => {
            console.error('Error changing status:', error);
        });
}