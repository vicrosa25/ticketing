import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  OneToOne,
  VersionColumn,
} from "typeorm";
import { classToPlain } from "class-transformer";
import { Ticket } from "./ticket";
import { OrderStatus } from "@tfg-victor-rosa/common";

export { OrderStatus };

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  userId: number;

  @Column({ nullable: false, default: OrderStatus.Created })
  status: OrderStatus;

  @Column()
  expireAt: Date;

  @VersionColumn()
  version: number;

  // @Column()
  // ticketid: number;

  @OneToOne(() => Ticket, {
    nullable: false,
  })
  @JoinColumn({ name: "ticketid" })
  ticket: Ticket;

  toJSON() {
    return classToPlain(this);
  }
}
