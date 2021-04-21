import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  AfterLoad,
} from "typeorm";
import { Password } from "../helpers/Password";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  private tempPassword: string;

  // check if password has changed
  @AfterLoad()
  private loadTempPassword(): void {
    this.tempPassword = this.password;
  }

  // Hashing the password before create and update the user
  @BeforeInsert()
  async encryptPassword(): Promise<void> {
    this.password = await Password.toHash(this.password);
  }
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.tempPassword !== this.password) {
      this.password = await Password.toHash(this.password);
    }
  }
}
