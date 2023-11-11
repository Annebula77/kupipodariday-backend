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
import {
  IsNumber,
  IsBoolean,
  IsDate,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';

@Entity()
export class Offer {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '2021-04-12T06:25:43.511Z' })
  @IsDate()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: '2021-04-12T06:25:43.511Z' })
  @IsDate()
  @UpdateDateColumn()
  updateAt: Date;

  @ManyToOne(() => User, (user) => user.offers)
  @IsNotEmpty()
  user: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  @IsNotEmpty()
  item: Wish;

  @ApiProperty({ example: 100.00 })
  @IsNumber()
  @Min(0.01)
  @Column('decimal', { scale: 2 })
  amount: number;

  @ApiProperty({ example: false })
  @IsBoolean()
  @Column({ default: false })
  hidden: boolean;
}