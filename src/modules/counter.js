// counter.js
export async function countStations(getStations) {
    try {
        const stations = await getStations();
        const activeStations = stations.filter(station => station.status).length;
        const inactiveStations = stations.filter(station => !station.status).length;
        return [activeStations, inactiveStations];
    } catch (error) {
        console.error('Error fetching stations:', error);
        throw error;
    }
}

export async function updateCounter(getStations) {
    try {
        const [active, inactive] = await countStations(getStations);
        const counter = document.querySelector('#counter');

        active === 0 && inactive === 0 ?
            counter.innerHTML = 'No stations found' :
            counter.innerHTML = `
            Active: <span id = 'active-counter'> ${active}</span> |
            Inactive: <span id = 'inactive-counter'> ${inactive}</span>
             `;

    } catch (error) {
        console.error('Error updating counter:', error);
        throw error;
    }
}