import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { classToPlain } from "class-transformer";
import { Ticket } from "./ticket";
import { OrderEstatus } from "@tfg-victor-rosa/common";

export { OrderEstatus };

@Entity("order")
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false, default: OrderEstatus.Created })
  status: OrderEstatus;

  @Column()
  expireAt: Date;

  @Column()
  ticketid: number;

  @OneToOne(() => Ticket, {
    nullable: false,
    cascade: true,
  })
  @JoinColumn()
  ticket: Ticket;

  toJSON() {
    return classToPlain(this);
  }
}
