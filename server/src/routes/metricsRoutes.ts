import { Router, Request, Response } from 'express';
import { PostgresDataSource } from '../utils/database';
import { Metrics } from '../entities/Metrics';
import { Stations } from '../entities/Station';

const metricsRouter = Router();
const stationRepository = PostgresDataSource.getRepository(Stations);
const metricsRepository = PostgresDataSource.getRepository(Metrics);

metricsRouter.get('/:id/metrics', async (req: Request, res: Response) => {
    const stationId = parseInt(req.params.id);
    try {
        const station = await stationRepository.findOne({
            where: { id: stationId },
        });

        if (!station) {
            return res.status(404).send('Station not found');
        }

        if (!station.status) {
            return res.status(200).json({
                temperature: 0,
                dose_rate: 0,
                humidity: 0,
                station: station,
            });
        }

        const metrics = await metricsRepository.find({
            where: { station: station },
            order: { timestamp: 'DESC' },
            take: 1,
        });

        if (metrics.length === 0) {
            return res.status(404).send('No metrics found for this station');
        }

        return res.status(200).json(metrics[0]);
    } catch (error) {
        console.error('Error fetching metrics:', error);
        return res.status(500).send('Error fetching metrics');
    }
});

export default metricsRouter;
