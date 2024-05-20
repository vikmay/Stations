import { Router, Request, Response } from 'express';
import { PostgresDataSource } from '../utils/database';
import { Stations } from '../entities/Station';
import { Metrics } from '../entities/Metrics';
import { generateMetrics } from '../services/metricsGenerator';
import updateStationIdSequence from '../utils/lastIdChecker';

const stationRouter = Router();
const stationRepository = PostgresDataSource.getRepository(Stations);
const metricsRepository = PostgresDataSource.getRepository(Metrics);

stationRouter.get('/:id/metrics', async (req: Request, res: Response) => {
    const station = await stationRepository.findOneBy({
        id: parseInt(req.params.id),
    });

    if (station && station.status) {
        const generatedMetrics = generateMetrics();

        const metricsEntity = metricsRepository.create({
            ...generatedMetrics,
            station_id: station.id,
        });
        const savedMetrics = await metricsRepository.save(metricsEntity);

        res.send(savedMetrics);
    } else {
        res.send({ temperature: 0, dose_rate: 0, humidity: 0 });
    }
});

stationRouter.get('/', async (req: Request, res: Response) => {
    const stations = await stationRepository.find({
        order: {
            id: 'ASC',
        },
    });
    res.send(stations);
});

stationRouter.get('/:id', async (req: Request, res: Response) => {
    const station = await stationRepository.findOneBy({
        id: parseInt(req.params.id),
    });
    res.send(station);
});

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

stationRouter.delete('/:id', async (req: Request, res: Response) => {
    const result = await stationRepository.delete(req.params.id);
    res.send(result);
});

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
