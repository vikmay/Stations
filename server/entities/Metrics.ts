import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { Station } from './Station';

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

    @ManyToOne(() => Station, (station) => station.metrics)
    @JoinColumn({ name: 'station_id' })
    station: Station;

    @Column()
    station_id: number;
}
