import {
  Entity,
  Column,
  BaseEntity,
  getRepository,
  PrimaryGeneratedColumn,
  PrimaryColumn,
} from "typeorm";
import { classToPlain } from "class-transformer";
import { Order, OrderStatus } from "./order";

@Entity("ticket")
export class Ticket extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  price: number;

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
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Cancelled,
        ],
      })
      .getOne();

    return existingOrder;
  }
}
