// import { Entity, PrimaryColumn, PrimaryGeneratedColumn, Column } from 'typeorm';

// @Entity()
// export class Station {
//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column('text')
//     address: string;

//     @Column()
//     status: boolean;
// }

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Metrics } from './Metrics';

@Entity()
export class Station {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    address: string;

    @Column()
    status: boolean;

    @OneToMany(() => Metrics, (metrics) => metrics.station)
    metrics: Metrics[];
}
