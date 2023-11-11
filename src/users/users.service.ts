import {
  ConflictException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { Repository, FindOneOptions, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileResponseDto } from './dto/response-user.dto';
import { USER_ALREADY_EXISTS_CONFLICT, USER_NOT_FOUND } from '../utils/consts';
import * as PasswordHelper from '../utils/password.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });
    if (existingUser) {
      throw new ConflictException(USER_ALREADY_EXISTS_CONFLICT);
    }
    const hashedPassword = await PasswordHelper.hashPassword(createUserDto.password);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.usersRepository.save(user);
  }

  async comparePassword(
    enteredPassword: string,
    dbPassword: string,
  ): Promise<boolean> {
    return await PasswordHelper.comparePasswords(enteredPassword, dbPassword);
  }

  async findUserOwnProfile(query: string): Promise<User> {
    return this.usersRepository.findOne({
      where: [
        { username: Like(`%${query}%`) },
        { password: Like(`%${query}%`) },
      ],
    });
  }

  async findUser(id: FindOneOptions<User>): Promise<User> {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return user;
  }

  async searchUsers(query: string): Promise<UserProfileResponseDto[]> {
    const users = await this.usersRepository.find({
      where: [{ username: Like(`%${query}%`) }, { email: Like(`%${query}%`) }],
    });

    return users.map(user => ({
      id: user.id,
      username: user.username,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      createdAt: user.createdAt.toISOString(), // Преобразование в строку ISO
      updatedAt: user.updateAt.toISOString(), // Обратите внимание на опечатку в имени поля `updateAt` - должно быть `updatedAt`
    }));
  }

  async findUserByUsername(query: string): Promise<User> {
    return this.usersRepository.findOne({
      where: [{ username: Like(`%${query}%`) }],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id } });
    const updatedUser = this.usersRepository.merge(user, updateUserDto);

    if (updateUserDto.password) {
      const hashedPassword = await PasswordHelper.hashPassword(updateUserDto.password);
      updatedUser.password = hashedPassword;
    }
    return this.usersRepository.save(updatedUser);
  }

  async getUserWishes(userId: number): Promise<Wish[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['wishes'],
    });
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return user.wishes;
  }

  async getOtherUserWishes(username: string): Promise<Wish[]> {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['wishes'],
    });
    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND);
    }
    return user.wishes;
  }
}
