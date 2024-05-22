export function filterStations(query, renderStations, stationData, currentFilter) {
    const filteredStations = stationData.filter(station => {
        const stationAddress = station.address.toLowerCase();
        const stationId = station.id.toString();
        const queryLowerCase = query.toLowerCase();

        const includesQuery = (
            stationAddress.includes(queryLowerCase) ||
            stationId.includes(queryLowerCase) ||
            "station".includes(queryLowerCase) ||
            `station ${stationId}`.includes(queryLowerCase)
        );

        if (currentFilter === 'active') {
            return station.status && includesQuery;
        } else if (currentFilter === 'inactive') {
            return !station.status && includesQuery;
        } else {
            return includesQuery;
        }
    });
    renderStations(filteredStations);
}