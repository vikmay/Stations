// Function to filter stations based on search query and current filter
export function filterStations(query, renderStations, stationData, currentFilter) {
    let filteredStations;
    switch (currentFilter) {
        case 'active':
            filteredStations = stationData.filter(station => station.status && (
                station.address.toLowerCase().includes(query.toLowerCase()) ||
                station.id.toString().includes(query.toLowerCase()) ||
                "Station".toLowerCase().includes(query.toLowerCase()) ||
                `Station ${station.id}`.toLowerCase().includes(query.toLowerCase())
            ));
            break;
        case 'inactive':
            filteredStations = stationData.filter(station => !station.status && (
                station.address.toLowerCase().includes(query.toLowerCase()) ||
                station.id.toString().includes(query.toLowerCase()) ||
                "Station".toLowerCase().includes(query.toLowerCase()) ||
                `Station ${station.id}`.toLowerCase().includes(query.toLowerCase())
            ));
            break;
        default:
            filteredStations = stationData.filter(station => (
                station.address.toLowerCase().includes(query.toLowerCase()) ||
                station.id.toString().includes(query.toLowerCase()) ||
                "Station".toLowerCase().includes(query.toLowerCase()) ||
                `Station ${station.id}`.toLowerCase().includes(query.toLowerCase())
            ));
            break;
    }

    renderStations(filteredStations);
}
