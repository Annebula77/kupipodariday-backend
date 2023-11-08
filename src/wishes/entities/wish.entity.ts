import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Wish {
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
  @Column()
  name: string;
  @ApiProperty({ example: 'link' })
  @Column()
  link: string;
  @ApiProperty({ example: 'string' })
  @Column()
  image: string;
  @ApiProperty({ example: 2 })
  @Column('decimal', { scale: 2 })
  price: number;
  @ApiProperty({ example: 2 })
  @Column('decimal', { scale: 2 })
  raised: number;
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;
  @Column()
  description: string;
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
  @ApiProperty({ example: 2 })
  @Column('int', { default: 0 })
  copied: number;
  @ManyToMany(() => User)
  @JoinTable()
  wishers: User[];
}
