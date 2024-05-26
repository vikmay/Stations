import express from 'express';
import cors from 'cors';
import { PostgresDataSource } from './utils/database';
import stationRouter from './routes/stationRoutes';
import metricsRouter from './routes/metricsRoutes';

const app = express();
const host = 'localhost';
const port = 3000;

app.use(express.json());
app.use(cors());

// Use the routers
app.use('/stations', stationRouter);
app.use('/stations', metricsRouter);

// Database connection and server setup
PostgresDataSource.initialize()
    .then(() => {
        console.log('Database connected!');

        app.listen(port, host, () => {
            console.log(`Server is running on http://${host}:${port}`);
        });
    })
    .catch((error) => console.log('Error connecting to the database', error));
