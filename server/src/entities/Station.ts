import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Metrics } from './Metrics';

@Entity()
export class Stations {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    address: string;

    @Column()
    status: boolean;

    @OneToMany(() => Metrics, (metrics) => metrics.station)
    metrics: Metrics[];
}
