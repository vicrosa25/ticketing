import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
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
    const existingOrder = await Order.findOne({
      where: {
        ticket: {
          id: this.id,
        },
        relations: ["ticket"],
        status: [
          OrderEstatus.Created,
          OrderEstatus.AwaitingPayment,
          OrderEstatus.Complete,
        ],
      },
    });

    return !!existingOrder;
  }
}
