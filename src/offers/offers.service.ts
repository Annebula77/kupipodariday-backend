import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { WishesService } from '../wishes/wishes.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { NOT_FOUND_GENERAL, WISH_OVERPRICE_ERROR, WISH_SELF_FORBIDDEN } from '../utils/consts';

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
      throw new ForbiddenException(WISH_SELF_FORBIDDEN);
    }
    if (wish.raised + createOfferDto.amount > wish.price) {
      throw new ForbiddenException(WISH_OVERPRICE_ERROR);
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
      throw new NotFoundException(NOT_FOUND_GENERAL);
    }
    return offer;
  }

  async findAll(): Promise<Offer[]> {
    return this.offersRepository.find({ relations: ['owner', 'item'] });
  }


}





