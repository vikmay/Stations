// Function to fetch and update metrics data
async function updateMetrics(stationId) {
    try {
        const metricsData = await fetchStationMetrics(stationId);
        console.log(metricsData); // Process the received metrics data
    } catch (error) {
        console.error('Error updating metrics:', error);
    }
}

// Assuming you have a button element in your HTML with id "get-metrics-btn"
const getMetricsBtn = document.getElementById('get-metrics-btn');

getMetricsBtn.addEventListener('click', () => {
    const stationId = /* Your station ID */
        // Call the updateMetrics function initially
        updateMetrics(stationId);
    // Start refreshing metrics data every second
    setInterval(() => {
        updateMetrics(stationId);
    }, 1000);
});