import { Router, Request, Response } from 'express';
import { PostgresDataSource } from '../utils/database';
import { Stations } from '../entities/Station';
import { Metrics } from '../entities/Metrics';
import updateStationIdSequence from '../utils/lastIdChecker';

const stationRouter = Router();
const stationRepository = PostgresDataSource.getRepository(Stations);
const metricsRepository = PostgresDataSource.getRepository(Metrics);

// // Fetch metrics for a specific station
// stationRouter.get('/:id/metrics', async (req: Request, res: Response) => {
//     const stationId = parseInt(req.params.id);
//     const station = await stationRepository.findOneBy({ id: stationId });

//     if (!station) {
//         return res.status(404).send('Station not found');
//     }

//     if (station.status) {
//         const metrics = await metricsRepository.find({
//             where: { station: { id: stationId } },
//             order: { timestamp: 'DESC' },
//             take: 1,
//         });

//         if (metrics.length > 0) {
//             return res.send(metrics[0]);
//         } else {
//             return res.status(404).send('No metrics found for this station');
//         }
//     } else {
//         return res.send({ temperature: 0, dose_rate: 0, humidity: 0 });
//     }
// });

// Fetch all stations
stationRouter.get('/', async (req: Request, res: Response) => {
    const stations = await stationRepository.find({
        order: {
            id: 'ASC',
        },
    });
    res.send(stations);
});

// Fetch a specific station by id
stationRouter.get('/:id', async (req: Request, res: Response) => {
    const station = await stationRepository.findOneBy({
        id: parseInt(req.params.id),
    });
    res.send(station);
});

// Create a new station
stationRouter.post('/', async (req: Request, res: Response) => {
    try {
        await updateStationIdSequence(PostgresDataSource);

        const station = stationRepository.create(req.body);
        const result = await stationRepository.save(station);

        res.send(result);
    } catch (error) {
        console.error('Error creating station:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Delete a station by id
stationRouter.delete('/:id', async (req: Request, res: Response) => {
    const result = await stationRepository.delete(req.params.id);
    res.send(result);
});

// Update a station by id
stationRouter.put('/:id', async (req: Request, res: Response) => {
    const station = await stationRepository.findOneBy({
        id: parseInt(req.params.id),
    });
    if (station) {
        stationRepository.merge(station, req.body);
        const result = await stationRepository.save(station);
        res.send(result);
    } else {
        res.sendStatus(404);
    }
});

export default stationRouter;
