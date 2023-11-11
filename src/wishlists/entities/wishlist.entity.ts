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
import { IsDate, IsString, IsNotEmpty, IsUrl, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@Entity()
export class Wishlist {
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

  @ApiProperty({ example: 'Nick' })
  @IsString()
  @IsNotEmpty()
  @Column()
  name: string;

  @ApiProperty({ example: 'This is a description.' })
  @IsString()
  @Column()
  description: string;

  @ApiProperty({ example: 'http://example.com/image.png' })
  @IsUrl()
  @Column()
  image: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Wish)
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists, { eager: true })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => User)
  owner: User;
}