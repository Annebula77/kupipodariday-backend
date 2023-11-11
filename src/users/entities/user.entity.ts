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
import { IsInt, IsDate, IsString, IsUrl, IsEmail, Length, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

@Entity()
export class User {
  @ApiProperty({ example: 1 })
  @IsInt()
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
  @Length(3, 20)
  @Column({ unique: true })
  username: string;

  @ApiProperty({ example: 'Пока еще не рассказал ничего о себе' })
  @IsString()
  @Column({ default: 'Пока еще не рассказал ничего о себе' })
  about: string;

  @ApiProperty({ example: 'https://i.pravatar.cc/300' })
  @IsUrl()
  @Column({ default: 'https://i.pravatar.cc/300' })
  avatar: string;

  @ApiProperty({ example: 'ex@ex.ru' })
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: '12345678' })
  @IsString()
  @Length(8, 255)
  @Column()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Wish)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Offer)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Wishlist)
  wishlists: Wishlist[];
}