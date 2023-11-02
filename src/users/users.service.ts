/* eslint-disable prettier/prettier */
import { ConflictException, NotFoundException, Injectable } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { WishesService } from '../wishes/wishes.service';
import * as bcrypt from 'bcrypt';
import { USER_ALREADY_EXISTS_CONFLICT, USER_NOT_FOUND } from '../utils/consts';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly wishesService: WishesService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne(
      {
        where: [{ username: createUserDto.username },
        { email: createUserDto.email }]
      });
    if (existingUser) {
      throw new ConflictException(USER_ALREADY_EXISTS_CONFLICT);
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword
    });
    return this.usersRepository.save(user);
  }

  async comparePassword(enteredPassword: string, dbPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, dbPassword);
  }

  async findUserOwnProfile(quiry: string): Promise<User> {
    return this.usersRepository.findOne({
      where: [
        { username: Like(`%${quiry}%`) },
        { password: Like(`%${quiry}%`) },
      ],
    })
  }


  async findUser(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return user;
  }

  async searchUsers(quiry: string): Promise<User> {
    return this.usersRepository.findOne({
      where: [
        { username: Like(`%${quiry}%`) },
        { email: Like(`%${quiry}%`) },
      ],
    })
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });
    const updatedUser = this.usersRepository.merge(user, updateUserDto);

    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 12);
      updatedUser.password = hashedPassword;
    }
    return this.usersRepository.save(updatedUser);
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    return this.usersRepository.delete(user);
  }

  async getUserWishes(userId: number): Promise<Wish[]> {
    const user = await this.usersRepository.findOne({ where: { id: userId }, relations: ['wishes'] });
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return user.wishes;
  }

  async getUserWish(userId: number, wishId: number): Promise<Wish> {
    return this.wishesService.findUserWishById(wishId, userId);  // Вызовите метод findOne из WishesService
  }


}
