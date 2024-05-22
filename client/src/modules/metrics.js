// import { baseUrl } from "../utils/configURL";

// let intervalId;
// export function handleGetMetrics(currentFilter, updateMetrics) {
//     document.addEventListener('click', async (e) => {

//         if (e.target.id === 'get-metrics') {
//             const stationId = e.target.dataset.id;
//             let metricsInfoSpan = document.getElementById(`metrics-info-${stationId}`);

//             if (!metricsInfoSpan) {
//                 const metricsData = await updateMetrics(stationId);
//                 const li = document.getElementById(`station-${stationId}`);
//                 li.innerHTML += `
//                 <div style="font-weight: bold;" class="metrics-info" id="metrics-info-${stationId}">
//                     <div><span>Temperature:</span> <span style="color: red;" id="temperature-${stationId}">${metricsData.temperature}</span></div>
//                     <div><span>Dose Rate:</span> <span style="color: blue;" id="dose-rate-${stationId}">${metricsData.dose_rate}</span></div>
//                     <div><span>Humidity:</span> <span style="color: green;" id="humidity-${stationId}">${metricsData.humidity}</span></div>
//                     <button class="close" data-id="${stationId}">&times</button>
//                 </div>`;

//                 // Update metrics for this station every 2 seconds
//                 intervalId = setInterval(async () => {
//                     const updatedMetricsData = await updateMetrics(stationId);
//                     const temperatureSpan = document.getElementById(`temperature-${stationId}`);
//                     const doseRateSpan = document.getElementById(`dose-rate-${stationId}`);
//                     const humiditySpan = document.getElementById(`humidity-${stationId}`);

//                     if (temperatureSpan && doseRateSpan && humiditySpan) {
//                         temperatureSpan.textContent = updatedMetricsData.temperature;
//                         doseRateSpan.textContent = updatedMetricsData.dose_rate;
//                         humiditySpan.textContent = updatedMetricsData.humidity;
//                     } else {
//                         clearInterval(intervalId);
//                     }
//                 }, 2000);
//             } else {
//                 // Metrics info span already exists, update metrics
//                 const metricsData = await updateMetrics(stationId);
//                 const temperatureSpan = document.getElementById(`temperature-${stationId}`);
//                 const doseRateSpan = document.getElementById(`dose-rate-${stationId}`);
//                 const humiditySpan = document.getElementById(`humidity-${stationId}`);

//                 temperatureSpan.textContent = metricsData.temperature;
//                 doseRateSpan.textContent = metricsData.dose_rate;
//                 humiditySpan.textContent = metricsData.humidity;
//             }
//         }

//         // Close metrics info when close or delete button is clicked
//         if (e.target.classList.contains('close') || e.target.classList.contains('delete-btn')) {
//             const stationId = e.target.dataset.id;
//             removeMetricsInfo(stationId);
//         }
//     });
// }

// function removeMetricsInfo(stationId) {
//     const metricsInfoSpan = document.getElementById(`metrics-info-${stationId}`);
//     if (metricsInfoSpan) {
//         metricsInfoSpan.remove();
//         clearInterval(intervalId);
//     }
// }

// export async function updateMetrics(stationId) {
//     try {
//         const response = await fetch(`${baseUrl}/stations/${stationId}/metrics`);
//         if (!response.ok) {
//             throw new Error('Failed to fetch metrics');
//         }
//         const metricsData = await response.json();
//         return metricsData;
//     } catch (error) {
//         console.error('Error updating metrics:', error);
//         return 'Error fetching metrics';
//     }
// }

import { baseUrl } from "../utils/configURL";

let ws;

export function handleGetMetrics(currentFilter, updateMetrics) {
    document.addEventListener('click', async (e) => {
        if (e.target.id === 'get-metrics') {
            const stationId = e.target.dataset.id;
            let metricsInfoSpan = document.getElementById(`metrics-info-${stationId}`);

            if (!metricsInfoSpan) {
                const metricsData = await updateMetrics(stationId);
                const li = document.getElementById(`station-${stationId}`);
                li.innerHTML += `
                <div style="font-weight: bold;" class="metrics-info" id="metrics-info-${stationId}">
                    <div><span>Temperature:</span> <span style="color: red;" id="temperature-${stationId}">${metricsData.temperature}</span></div>
                    <div><span>Dose Rate:</span> <span style="color: blue;" id="dose-rate-${stationId}">${metricsData.dose_rate}</span></div>
                    <div><span>Humidity:</span> <span style="color: green;" id="humidity-${stationId}">${metricsData.humidity}</span></div>
                    <button class="close" data-id="${stationId}">&times</button>
                </div>`;

                // Establish WebSocket connection
                ws = new WebSocket(`ws://${window.location.host}/metrics/${stationId}`);

                ws.onmessage = (event) => {
                    const updatedMetricsData = JSON.parse(event.data);
                    const temperatureSpan = document.getElementById(`temperature-${stationId}`);
                    const doseRateSpan = document.getElementById(`dose-rate-${stationId}`);
                    const humiditySpan = document.getElementById(`humidity-${stationId}`);

                    if (temperatureSpan && doseRateSpan && humiditySpan) {
                        temperatureSpan.textContent = updatedMetricsData.metrics.temperature;
                        doseRateSpan.textContent = updatedMetricsData.metrics.dose_rate;
                        humiditySpan.textContent = updatedMetricsData.metrics.humidity;
                    }
                };

                ws.onclose = () => {
                    console.log(`WebSocket connection for station ${stationId} closed`);
                };

                ws.onerror = (error) => {
                    console.error(`WebSocket error for station ${stationId}:`, error);
                };
            } else {
                // Metrics info span already exists, update metrics
                const metricsData = await updateMetrics(stationId);
                const temperatureSpan = document.getElementById(`temperature-${stationId}`);
                const doseRateSpan = document.getElementById(`dose-rate-${stationId}`);
                const humiditySpan = document.getElementById(`humidity-${stationId}`);

                temperatureSpan.textContent = metricsData.temperature;
                doseRateSpan.textContent = metricsData.dose_rate;
                humiditySpan.textContent = metricsData.humidity;
            }
        }

        // Close metrics info when close or delete button is clicked
        if (e.target.classList.contains('close') || e.target.classList.contains('delete-btn')) {
            const stationId = e.target.dataset.id;
            removeMetricsInfo(stationId);
        }
    });
}

function removeMetricsInfo(stationId) {
    const metricsInfoSpan = document.getElementById(`metrics-info-${stationId}`);
    if (metricsInfoSpan) {
        metricsInfoSpan.remove();
        if (ws) {
            ws.close();
        }
    }
}

export async function updateMetrics(stationId) {
    try {
        const response = await fetch(`${baseUrl}/stations/${stationId}/metrics`);
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
