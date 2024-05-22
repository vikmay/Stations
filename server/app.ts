import express from 'express';
import cors from 'cors';
import { PostgresDataSource } from './utils/database';
import stationRouter from './routes/stationRoutes';
import metricsRouter from './routes/metricsRoutes';
import { setupWebSocketServer } from './websockets/metricsWebSocket';
import { Metrics } from './entities/Metrics';

const app = express();
const host = 'localhost';
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/stations', stationRouter);
app.use('/metrics', metricsRouter);

// Initialize the database and start the server
PostgresDataSource.initialize()
    .then(async () => {
        console.log('Database connected!');

        const server = app.listen(port, host, () => {
            console.log(`Server is running on http://${host}:${port}`);
        });

        // Setup WebSocket server
        setupWebSocketServer(server);
    })
    .catch((error) => console.log('Error connecting to the database', error));

// Route to fetch the latest metrics for a station
app.get('/stations/:id/metrics', async (req, res) => {
    const stationId = parseInt(req.params.id, 10);
    const metrics = await PostgresDataSource.getRepository(Metrics).find({
        where: { station: { id: stationId } },
        order: { timestamp: 'DESC' },
        take: 1,
    });
    res.json(metrics.length > 0 ? metrics[0] : {});
});
