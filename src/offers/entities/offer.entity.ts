import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Offer {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty({ example: 1 })
  @CreateDateColumn()
  createdAt: Date;
  @ApiProperty({ example: 1 })
  @UpdateDateColumn()
  updateAt: Date;
  @ManyToOne(() => User, (user) => user.offers)
  user: User;
  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;
  @ApiProperty({ example: 1 })
  @Column('decimal', { scale: 2 })
  amount: number;
  @ApiProperty({ example: 1 })
  @Column({ default: false })
  hidden: boolean;
}
