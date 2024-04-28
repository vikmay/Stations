export function handleGetMetrics(currentFilter, updateMetrics) {
    document.addEventListener('click', async (e) => {
        let intervalId;

        // Check if the click target has the id 'get-metrics'
        if (e.target.id === 'get-metrics') {
            const stationId = e.target.dataset.id;
            let metricsInfoSpan = document.getElementById(`metrics-info-${stationId}`);

            if (!metricsInfoSpan) {
                // Metrics info span does not exist, fetch metrics data and append it
                const metricsData = await updateMetrics(stationId);
                const li = document.getElementById(`station-${stationId}`);
                li.innerHTML += `
                <div style="font-weight: bold;" class="metrics-info" id="metrics-info-${stationId}">
                    <div><span>Temperature:</span> <span style="color: red;" id="temperature-${stationId}">${metricsData.temperature}</span></div> 
                    <div><span>Dose Rate:</span> <span style="color: blue;" id="dose-rate-${stationId}">${metricsData.dose_rate}</span></div> 
                    <div><span>Humidity:</span> <span style="color: green;" id="humidity-${stationId}">${metricsData.humidity}</span></div>
                    <button class="close" data-id="${stationId}">&times</button>
                </div>`;

                // Update metrics for this station every 2 seconds
                intervalId = setInterval(async () => {
                    const updatedMetricsData = await updateMetrics(stationId);
                    const temperatureSpan = document.getElementById(`temperature-${stationId}`);
                    const doseRateSpan = document.getElementById(`dose-rate-${stationId}`);
                    const humiditySpan = document.getElementById(`humidity-${stationId}`);

                    if (temperatureSpan && doseRateSpan && humiditySpan) {
                        temperatureSpan.textContent = updatedMetricsData.temperature;
                        doseRateSpan.textContent = updatedMetricsData.dose_rate;
                        humiditySpan.textContent = updatedMetricsData.humidity;
                    } else {
                        clearInterval(intervalId); // Stop interval if elements are not found
                    }
                }, 2000);
            } else {
                // Metrics info span already exists, update its content with the latest metrics data fetched from the server.
                const metricsData = await updateMetrics(stationId);
                const temperatureSpan = document.getElementById(`temperature-${stationId}`);
                const doseRateSpan = document.getElementById(`dose-rate-${stationId}`);
                const humiditySpan = document.getElementById(`humidity-${stationId}`);

                temperatureSpan.textContent = metricsData.temperature;
                doseRateSpan.textContent = metricsData.dose_rate;
                humiditySpan.textContent = metricsData.humidity;
            }
        }

        // Close metrics info when close button is clicked
        if (e.target.classList.contains('close')) {
            const stationId = e.target.dataset.id;
            const metricsInfoSpan = document.getElementById(`metrics-info-${stationId}`);
            if (metricsInfoSpan) {
                metricsInfoSpan.remove();
                clearInterval(intervalId);
            }
        }
    });
}

export async function updateMetrics(stationId) {
    try {
        const response = await fetch(`http://localhost:3000/stations/${stationId}/metrics`);
        if (!response.ok) {
            throw new Error('Failed to fetch metrics');
        }
        const metricsData = await response.json();
        return metricsData;
    } catch (error) {
        console.error('Error updating metrics:', error);
        return 'Error fetching metrics';
    }
}
