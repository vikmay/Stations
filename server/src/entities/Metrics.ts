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

    @Column('float')
    temperature: number;

    @Column('float')
    dose_rate: number;

    @Column('float')
    humidity: number;

    @CreateDateColumn({ type: 'timestamp without time zone' })
    timestamp: Date;

    @Column()
    station_id: number;

    @ManyToOne(() => Stations, (stations) => stations.metrics, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'station_id' })
    station: Stations;
}
