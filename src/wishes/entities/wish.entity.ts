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
import { IsString, IsNotEmpty, IsUrl, IsDecimal, IsInt, IsDate, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

@Entity()
export class Wish {
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

  @ApiProperty({ example: 'http://example.com/product' })
  @IsUrl()
  @Column()
  link: string;

  @ApiProperty({ example: 'http://example.com/image.png' })
  @IsUrl()
  @Column()
  image: string;

  @ApiProperty({ example: '100.00' })
  @IsDecimal({ decimal_digits: '2' })
  @Column('decimal', { scale: 2 })
  price: number;

  @ApiProperty({ example: '50.00' })
  @IsDecimal({ decimal_digits: '2' })
  @Column('decimal', { scale: 2 })
  raised: number;

  @ManyToOne(() => User, (user) => user.wishes)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => User)
  owner: User;

  @ApiProperty({ example: 'This is a description.' })
  @IsString()
  @Column()
  description: string;

  @OneToMany(() => Offer, (offer) => offer.item)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Offer)
  offers: Offer[];

  @ApiProperty({ example: 10 })
  @IsInt()
  @Column('int', { default: 0 })
  copied: number;

  @ManyToMany(() => User)
  @JoinTable()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => User)
  wishers: User[];
}