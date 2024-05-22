import { Router, Request, Response } from 'express';
import { PostgresDataSource } from '../utils/database';
import { Metrics } from '../entities/Metrics';
import { Stations } from '../entities/Station';

const metricsRouter = Router();

metricsRouter.get('/:stationId', async (req: Request, res: Response) => {
    const stationId = parseInt(req.params.stationId);

    try {
        const station = await PostgresDataSource.getRepository(
            Stations
        ).findOne({ where: { id: stationId } });

        if (!station) {
            return res.status(404).send('Station not found');
        }

        // Fetch the latest metrics for the given station
        const metrics = await PostgresDataSource.getRepository(Metrics).find({
            where: { station: station },
            order: { timestamp: 'DESC' },
            take: 1, // Fetch the latest entry
        });

        if (metrics.length === 0) {
            return res.status(404).send('No metrics found for this station');
        }

        return res.status(200).send(metrics[0]);
    } catch (error) {
        console.error('Error fetching metrics:', error);
        return res.status(500).send('Error fetching metrics');
    }
});

export default metricsRouter;
