/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private wishesRepository: Repository<Wish>,
  ) { }

  async create(createWishDto: CreateWishDto, ownerId: number): Promise<Wish> {
    const wish = await this.wishesRepository.create({
      ...createWishDto,
      owner: { id: ownerId },
    });
    return this.wishesRepository.save(wish);
  }
  async update(id: number, updateWishDto: UpdateWishDto, userId: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id: id },
      relations: ['owner']
    });

    if (!wish) {
      throw new NotFoundException('Wish not found');
    }

    // Проверка на владельца и на то, что на подарок еще никто не скинулся
    if (wish.owner.id !== userId || wish.raised > 0) {
      throw new ForbiddenException('You do not have permission to edit this wish');
    }

    const updatedWish = this.wishesRepository.merge(wish, updateWishDto);
    return this.wishesRepository.save(updatedWish);
  }


  async remove(id: number, userId: number): Promise<void> {
    const wish = await this.wishesRepository.findOne({
      where: { id: id },
      relations: ['owner']
    });

    if (!wish) {
      throw new NotFoundException('Wish not found');
    }

    // Проверка на владельца
    if (wish.owner.id !== userId) {
      throw new ForbiddenException('You do not have permission to delete this wish');
    }

    await this.wishesRepository.remove(wish);
  }

  async getRecentWishes(): Promise<Wish[]> {
    return this.wishesRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  async getPupularWishes(): Promise<Wish[]> {
    return this.wishesRepository.find({
      order: { copied: 'DESC' },
      take: 20,
    });
  }

  async findUserWishById(id: number, ownerId: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({ where: { id, owner: { id: ownerId } } });
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }
    return wish;
  }

  async searchWishesByName(name: string): Promise<Wish[]> {
    return this.wishesRepository.find({ where: { name: Like(`%${name}%`) } });
  }

  async searchWishesByDescription(description: string): Promise<Wish[]> {
    return this.wishesRepository.find({ where: { description: Like(`%${description}%`) } });
  }


  async getWishInfo(id: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id: id },
      relations: ['owner', 'wishers', 'offers']
    });
    if (!wish) {
      throw new NotFoundException('Wish not found');
    }
    return wish;
  }

  async copyWish(id: number, userId: number): Promise<Wish> {
    // Находим существующий подарок по его id
    const existingWish = await this.wishesRepository.findOne({ where: { id } });
    if (!existingWish) {
      throw new NotFoundException('Wish not found');
    }

    // Увеличиваем счетчик copied у существующего подарка на 1
    existingWish.copied += 1;
    await this.wishesRepository.save(existingWish);

    // Создаем новый объект подарка со свойствами существующего подарка
    const newWish = this.wishesRepository.create({
      ...existingWish,  // Копируем свойства существующего подарка
      id: undefined,  // Убеждаемся, что у нового подарка будет новый id
      owner: { id: userId },  // Устанавливаем нового владельца
      copied: 0,  // Сбрасываем счетчик copied для нового подарка
    });

    // Сохраняем новый подарок в базу данных и возвращаем его
    return this.wishesRepository.save(newWish);
  }

  async findWishesByIds(ids: number[]): Promise<Wish[]> {
    // Используйте метод findBy репозитория TypeORM с оператором In для получения массива объектов Wish
    const wishes = await this.wishesRepository.findBy({ id: In(ids) });
    if (wishes.length !== ids.length) {
      // Это проверка на случай, если один или несколько идентификаторов не найдены в базе данных
      throw new NotFoundException('One or more wishes not found');
    }
    return wishes;
  }
}
