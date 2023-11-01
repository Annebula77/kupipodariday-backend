/* eslint-disable prettier/prettier */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistsRepository: Repository<Wishlist>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly wishesService: WishesService,
  ) { }


  async create(
    createWishlistDto: CreateWishlistDto,
    userId: number,
  ): Promise<Wishlist> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Получаем объекты Wish из базы данных
    const wishes = await this.wishesService.findWishesByIds(
      createWishlistDto.itemIds,
    );

    const wishlist = this.wishlistsRepository.create({
      ...createWishlistDto,
      owner: user,
      items: wishes, // устанавливаем свойство items объекта wishlist
    });

    return this.wishlistsRepository.save(wishlist);
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto, userId: number): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id: id },
      relations: ['owner', 'items']
    });
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    // Проверка на владельца
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('You do not have permission to edit this wishlist');
    }

    if (updateWishlistDto.itemIds) {
      wishlist.items = await this.wishesService.findWishesByIds(updateWishlistDto.itemIds);
    }

    const updatedWishlist = this.wishlistsRepository.merge(wishlist, updateWishlistDto);
    return this.wishlistsRepository.save(updatedWishlist);
  }


  async findAll(): Promise<Wishlist[]> {
    return this.wishlistsRepository.find({ relations: ['owner', 'items'] });
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id: id },
      relations: ['owner', 'items']
    });
    if (!wishlist) {
      throw new NotFoundException(`Wishlist #${id} not found`);
    }
    return wishlist;
  }

  async remove(id: number, userId: number): Promise<void> {
    const wishlist = await this.wishlistsRepository.findOne({
      where: { id: id },
      relations: ['owner']
    });
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    // Проверка на владельца
    if (wishlist.owner.id !== userId) {
      throw new ForbiddenException('You do not have permission to delete this wishlist');
    }

    await this.wishlistsRepository.remove(wishlist);
  }

  async searchWishlists(query: string): Promise<Wishlist[]> {
    return this.wishlistsRepository.find({
      where: [
        { name: Like(`%${query}%`) },
        { description: Like(`%${query}%`) },
      ],
      relations: ['owner', 'items'],
    });
  }
}

