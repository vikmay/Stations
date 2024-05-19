import { Metrics } from '../entities/Metrics';

let lastTemperatureValue = 36;
let lastDoseRateValue = 5;
let lastHumidityValue = 75;

export function generateRandomNumbers(
    min: number,
    max: number,
    lastValue: number | null
): number {
    if (lastValue === null) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    } else {
        const low = Math.max(min, lastValue - 1);
        const high = Math.min(max, lastValue + 1);
        return Math.floor(Math.random() * (high - low + 1)) + low;
    }
}

export function generateMetrics(): Partial<Metrics> {
    lastTemperatureValue = generateRandomNumbers(10, 60, lastTemperatureValue);
    lastDoseRateValue = generateRandomNumbers(0, 12, lastDoseRateValue);
    lastHumidityValue = generateRandomNumbers(30, 90, lastHumidityValue);

    return {
        temperature: lastTemperatureValue,
        dose_rate: lastDoseRateValue,
        humidity: lastHumidityValue,
        timestamp: new Date(new Date().setMilliseconds(0)),
    };
}
