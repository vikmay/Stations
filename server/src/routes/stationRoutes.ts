import { Router, Request, Response } from 'express';
import { PostgresDataSource } from '../utils/database';
import { Stations } from '../entities/Station';

const stationRouter = Router();
const stationRepository = PostgresDataSource.getRepository(Stations);

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

// // Create a new station
// stationRouter.post('/', async (req: Request, res: Response) => {
//     try {
//         const station = stationRepository.create(req.body);
//         const result = await stationRepository.save(station);

//         res.send(result);
//     } catch (error) {
//         console.error('Error creating station:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// Create a new station
stationRouter.post('/', async (req: Request, res: Response) => {
    try {
        const { id, ...stationData } = req.body; // Ensure id is not included
        const station = stationRepository.create(stationData);
        const result = await stationRepository.save(station);

        res.send(result);
    } catch (error) {
        console.error('Error creating station:', error);
        if (error.code === '23505') {
            // Unique violation error code for PostgreSQL
            res.status(400).send({
                message: 'Station with the same ID already exists.',
            });
        } else {
            res.status(500).send('Internal Server Error');
        }
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
