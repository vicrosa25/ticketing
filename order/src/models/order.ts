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
import { OrderStatus } from "@tfg-victor-rosa/common";

export { OrderStatus };

@Entity("order")
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false, default: OrderStatus.Created })
  status: OrderStatus;

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
