import { classToPlain } from "class-transformer";
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {Ticket} from  "./ticket"

@Entity()
export class Photo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cloudId: string;

    @Column()
    url: string;

    @Column()
    secureUrl: string;

    @ManyToOne(() => Ticket, ticket => ticket.photos)
    ticket: Ticket;

    toJSON() {
        return classToPlain(this);
      }

}