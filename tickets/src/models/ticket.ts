import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from "typeorm";
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

  toJSON() {
    return classToPlain(this);
  }
}
