import { DataSource } from 'typeorm';
import { Stations } from '../entities/Station';
import { Metrics } from '../entities/Metrics';

export const PostgresDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'oksana12',
    database: 'radalarm',
    synchronize: true,
    logging: false,
    entities: [Stations, Metrics],
});
