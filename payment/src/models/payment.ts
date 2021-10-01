import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { classToPlain } from "class-transformer";

@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: number;

  @Column()
  stripeId: string;

  toJason() {
    return classToPlain(this);
  }
}
