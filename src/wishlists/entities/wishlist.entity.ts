import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updateAt: Date;
  @Column()
  name: string;
  @Column()
  description: string;
  @Column()
  image: string;
  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
  @ManyToOne(() => User, (user) => user.wishlists, { eager: true })
  owner: User;
}
