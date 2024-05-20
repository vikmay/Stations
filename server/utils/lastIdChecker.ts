import { DataSource, Repository } from 'typeorm';
import { Stations } from '../entities/Station';

async function updateStationIdSequence(dataSource: DataSource) {
    const stationRepository: Repository<Stations> =
        dataSource.getRepository(Stations);
    const lastStation = await stationRepository
        .createQueryBuilder('station')
        .orderBy('station.id', 'DESC')
        .getOne();

    const nextId = lastStation ? lastStation.id + 1 : 1;

    await dataSource.query(
        `ALTER SEQUENCE stations_id_seq RESTART WITH ${nextId}`
    );
}

export default updateStationIdSequence;
