import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  getRepository,
} from "typeorm";
import { classToPlain } from "class-transformer";
import { Order, OrderEstatus } from "./order";

@Entity("ticket")
export class Ticket extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false, default: 1 })
  version: number;

  toJSON() {
    return classToPlain(this);
  }

  async isReserved() {
    const orderRepository = getRepository(Order);
    const existingOrder = orderRepository
      .createQueryBuilder()
      .where("ticketid = :id", { id: this.id })
      .andWhere("status IN (:...orderStatus)", {
        orderStatus: [
          OrderEstatus.Created,
          OrderEstatus.AwaitingPayment,
          OrderEstatus.Cancelled,
        ],
      })
      .getOne();

    return existingOrder;
  }
}
