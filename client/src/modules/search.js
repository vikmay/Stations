export function handleSearchInput(currentFilter, btnActiveStations, btnNotActiveStations, btnAllStations, filterStations, renderStations, stationData) {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', () => {
        const searchQuery = searchInput.value.trim();

        if (searchQuery === '') {
            if (currentFilter === 'active') {
                btnActiveStations.click();
            } else if (currentFilter === 'inactive') {
                btnNotActiveStations.click();
            } else {
                btnAllStations.click();
            }
        } else {
            filterStations(searchQuery, renderStations, stationData, currentFilter, btnActiveStations, btnNotActiveStations, btnAllStations);
        }
    });
}