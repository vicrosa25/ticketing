import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  VersionColumn,
} from "typeorm";
import { classToPlain } from "class-transformer";

@Entity()
export class Ticket extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  price: number;

  @Column({ nullable: false })
  userId: number;

  @Column({ type: "int", nullable: true })
  orderId: number | null;

  @VersionColumn()
  version: number;

  toJSON() {
    return classToPlain(this);
  }
}
