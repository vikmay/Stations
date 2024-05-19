// import { Router, Request, Response } from 'express';
// import { PostgresDataSource } from '../utils/database';
// import { Station } from '../entities/Station';
// import { generateMetrics } from '../services/metricsGenerator';

// const stationRouter = Router();
// const stationRepository = PostgresDataSource.getRepository(Station);

// stationRouter.get('/', async (req: Request, res: Response) => {
//     const stations = await stationRepository.find();
//     res.send(stations);
// });

// stationRouter.get('/:id', async (req: Request, res: Response) => {
//     const station = await stationRepository.findOneBy({
//         id: parseInt(req.params.id),
//     });
//     res.send(station);
// });

// stationRouter.post('/', async (req: Request, res: Response) => {
//     const station = stationRepository.create(req.body);
//     const result = await stationRepository.save(station);
//     res.send(result);
// });

// stationRouter.delete('/:id', async (req: Request, res: Response) => {
//     const result = await stationRepository.delete(req.params.id);
//     res.send(result);
// });

// stationRouter.put('/:id', async (req: Request, res: Response) => {
//     const station = await stationRepository.findOneBy({
//         id: parseInt(req.params.id),
//     });
//     if (station) {
//         stationRepository.merge(station, req.body);
//         const result = await stationRepository.save(station);
//         res.send(result);
//     } else {
//         res.sendStatus(404);
//     }
// });

// stationRouter.get('/:id/metrics', async (req: Request, res: Response) => {
//     const station = await stationRepository.findOneBy({
//         id: parseInt(req.params.id),
//     });
//     if (station && station.status) {
//         const metrics = generateMetrics();
//         res.send(metrics);
//     } else {
//         res.send({ temperature: 0, dose_rate: 0, humidity: 0 });
//     }
// });

// export { stationRouter };

import { Router, Request, Response } from 'express';
import { PostgresDataSource } from '../utils/database';
import { Station } from '../entities/Station';
import { Metrics } from '../entities/Metrics';
import { generateMetrics } from '../services/metricsGenerator';

const stationRouter = Router();
const stationRepository = PostgresDataSource.getRepository(Station);
const metricsRepository = PostgresDataSource.getRepository(Metrics);

stationRouter.get('/:id/metrics', async (req: Request, res: Response) => {
    const station = await stationRepository.findOneBy({
        id: parseInt(req.params.id),
    });

    if (station && station.status) {
        const generatedMetrics = generateMetrics();

        // Create and save the metrics entity
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
    const stations = await stationRepository.find();
    res.send(stations);
});

stationRouter.get('/:id', async (req: Request, res: Response) => {
    const station = await stationRepository.findOneBy({
        id: parseInt(req.params.id),
    });
    res.send(station);
});

stationRouter.post('/', async (req: Request, res: Response) => {
    const station = stationRepository.create(req.body);
    const result = await stationRepository.save(station);
    res.send(result);
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
