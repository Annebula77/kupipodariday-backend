import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Wish } from '../../wishes/entities/wish.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({ example: Date })
  @CreateDateColumn()
  createdAt: Date;
  @ApiProperty({ example: Date })
  @UpdateDateColumn()
  updateAt: Date;
  @ApiProperty({ example: 'Nick' })
  @Column({ unique: true })
  username: string;
  @ApiProperty({ example: 'Пока еще не рассказал ничего о себе' })
  @Column({ default: 'Пока еще не рассказал ничего о себе' })
  about: string;
  @ApiProperty({ example: 'https://i.pravatar.cc/300' })
  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar: string;
  @ApiProperty({ example: 'ex@ex.ru' })
  @Column({ unique: true })
  email: string;
  @ApiProperty({ example: '12345678' })
  @Column()
  password: string;
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];
  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
