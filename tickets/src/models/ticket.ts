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

  @Column()
  description: string;

  @Column({ nullable: false })
  userId: number;

  @Column({ type: "int", nullable: true })
  orderId: number | null;

  @VersionColumn()
  version: number;
  
  
  @OneToMany(() => Photo, photo => photo.ticket, { cascade: true})
  photos: Photo[];

  
  addPhoto(photo: Photo) {
    if(this.photos === undefined) {
      this.photos = Array<Photo>();
    }
    this.photos.push(photo);
  }

  static getById(id: string) {
    return Ticket.findOne(id, {relations: ["photos"]})
  }


  toJSON() {
    return classToPlain(this);
  }
}
