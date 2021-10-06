import {
  Entity,
  Column,
  BaseEntity,
  VersionColumn,
  PrimaryColumn,
} from "typeorm";
import { classToPlain } from "class-transformer";
import { OrderStatus } from "@tfg-victor-rosa/common";

export { OrderStatus };

@Entity()
export class Order extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @VersionColumn()
  version: number;

  @Column()
  userId: number;

  @Column()
  status: OrderStatus;

  @Column({ type: "numeric" })
  price: number;

  static findByIdAndPreviusVersion(id: number, version: number) {
    const preVersion = version - 1;
    return this.createQueryBuilder("order")
      .where("order.id = :id", { id })
      .andWhere("order.version = :preVersion", { preVersion })
      .getOne();
  }

  toJSON() {
    return classToPlain(this);
  }
}
