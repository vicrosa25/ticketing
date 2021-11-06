import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  JoinColumn,
  OneToOne,
  VersionColumn,
  CreateDateColumn,
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

  @CreateDateColumn()
  createAt: Date;

  @VersionColumn()
  version: number;

  @OneToOne(() => Ticket, {
    nullable: false,
    cascade: false,
  })
  @JoinColumn({ name: "ticketid" })
  ticket: Ticket;

  toJSON() {
    return classToPlain(this);
  }
}
