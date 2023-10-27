import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updateAt: Date;
  @Column()
  name: string;
  @Column()
  link: string;
  @Column()
  image: string;
  @Column('decimal', { scale: 2 })
  price: number;
  @Column('decimal', { scale: 2 })
  raised: number;
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;
  @Column()
  description: string;
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
  @Column('int', { default: 0 })
  copied: number;
}
