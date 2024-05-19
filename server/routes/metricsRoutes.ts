import { Router, Request, Response } from 'express';
import { generateMetrics } from '../services/metricsGenerator';

const metricsRouter = Router();

metricsRouter.post('/', (req: Request, res: Response) => {
    try {
        const result = generateMetrics();
        res.status(201).send(result);
    } catch (error) {
        console.error('Error generating metrics:', error);
        res.status(500).send('Error generating metrics');
    }
});

export default metricsRouter;
