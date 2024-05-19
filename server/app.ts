import express from 'express';
import cors from 'cors';
import { PostgresDataSource } from './utils/database';
import stationRouter from './routes/stationRoutes';
import metricsRouter from './routes/metricsRoutes';

const app = express();
const host = 'localhost';
const port = 3000;

// Middleware
app.use(express.json());
app.use(cors());

PostgresDataSource.initialize()
    .then(async () => {
        console.log('Database connected!');

        app.use('/stations', stationRouter);
        app.use('/metrics', metricsRouter);

        app.listen(port, host, () => {
            console.log(`Server is running on http://${host}:${port}`);
        });
    })
    .catch((error) => console.log('Error connecting to the database', error));
