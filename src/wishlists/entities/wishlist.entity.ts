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
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Wishlist {
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
  @ApiProperty({ example: 'string' })
  @Column()
  description: string;
  @ApiProperty({ example: 'string' })
  @Column()
  image: string;
  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
  @ManyToOne(() => User, (user) => user.wishlists, { eager: true })
  owner: User;
}
