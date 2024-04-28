export function changeStationStatus(stationId, stationData, currentFilter, renderStations) {
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
            station.status = !station.status;
            if (currentFilter === 'active') {
                const activeStations = stationData.filter(station => station.status);
                renderStations(activeStations);
            } else if (currentFilter === 'inactive') {
                const inactiveStations = stationData.filter(station => !station.status);
                renderStations(inactiveStations);
            } else {
                renderStations(stationData);
            }
        })
        .catch((error) => {
            console.error('Error changing status:', error);
        });
}