import { Router, Request, Response } from 'express';
import { generateMetrics } from '../services/metricsGenerator';

const metricsRouter = Router();

// Route to generate and save metrics
metricsRouter.post('/', async (req: Request, res: Response) => {
    try {
        const result = await generateMetrics();
        res.status(201).send(result);
    } catch (error) {
        console.error('Error generating metrics:', error);
        res.status(500).send('Error generating metrics');
    }
});

export default metricsRouter;
