/* eslint-disable prettier/prettier */
import { ConflictException, NotFoundException, Injectable } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne(
      {
        where: [{ username: createUserDto.username },
        { email: createUserDto.email }]
      });
    if (existingUser) {
      throw new ConflictException('User with this username or email already exists');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword
    });
    return this.usersRepository.save(user);
  }

  async findUser(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
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
}
