import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { Stations } from './Station';

@Entity('metrics')
export class Metrics {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    temperature: number;

    @Column()
    dose_rate: number;

    @Column()
    humidity: number;

    @CreateDateColumn({ type: 'timestamp without time zone' })
    timestamp: Date;

    @ManyToOne(() => Stations, (stations) => stations.metrics)
    @JoinColumn({ name: 'station_id' })
    station: Stations;

    @Column()
    station_id: number;
}
