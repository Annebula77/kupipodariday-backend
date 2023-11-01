/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { WishesService } from '../wishes/wishes.service';
import { CreateOfferDto } from './dto/create-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private wishesService: WishesService,
  ) { }


  async create(createOfferDto: CreateOfferDto, userId: number): Promise<Offer> {
    const wish = await this.wishesService.getWishInfo(createOfferDto.wishId);
    if (wish.owner.id === userId) {
      throw new ForbiddenException('You cannot contribute to your own wish');
    }
    if (wish.raised + createOfferDto.amount > wish.price) {
      throw new ForbiddenException('The total amount exceeds the price of the wish');
    }
    const offer = this.offersRepository.create({
      ...createOfferDto,
      user: { id: userId }
    });
    return this.offersRepository.save(offer);
  }

  async findOne(id: number): Promise<Offer> {
    const offer = await this.offersRepository.findOne({ where: { id } });
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }
    return offer;
  }

  async findAll(): Promise<Offer[]> {
    return this.offersRepository.find({ relations: ['owner', 'item'] });
  }


}





