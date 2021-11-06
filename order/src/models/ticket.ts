import {
  Entity,
  Column,
  BaseEntity,
  getRepository,
  PrimaryColumn,
  VersionColumn,
  OneToMany
} from "typeorm";
import { classToPlain } from "class-transformer";
import { Order, OrderStatus } from "./order";
import { Photo } from './Photo';

@Entity()
export class Ticket extends BaseEntity {
  @PrimaryColumn()
  id: number;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false, type: "numeric" })
  price: number;

  @Column()
  description: string;

  @VersionColumn()
  version: number;

  @Column({ type: "int", nullable: true })
  orderId: number | null;

  @OneToMany(() => Photo, photo => photo.ticket, { cascade: true})
  photos: Photo[];


  addPhoto(photo: Photo) {
    if(this.photos === undefined) {
      this.photos = Array<Photo>();
    }
    this.photos.push(photo);
  }


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
          OrderStatus.Complete
        ],
      })
      .getOne();
    return existingOrder;
  }

  static findByIdAndPreviusVersion(id: number, version: number) {
    const preVersion = version - 1;
    return this.createQueryBuilder("ticket")
      .where("ticket.id = :id", { id })
      .andWhere("ticket.version = :preVersion", { preVersion })
      .getOne();
  }
}
