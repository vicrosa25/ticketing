import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  VersionColumn,
  OneToMany,
} from "typeorm";
import { classToPlain } from "class-transformer";
import { Photo } from "./Photo";

@Entity()
export class Ticket extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false, type: "numeric" })
  price: number;

  @Column({ nullable: false })
  userId: number;

  @Column({ type: "int", nullable: true })
  orderId: number | null;

  @OneToMany(() => Photo, photo => photo.ticket, {nullable: true})
    photos: Photo[];

  @VersionColumn()
  version: number;

  toJSON() {
    return classToPlain(this);
  }
}
