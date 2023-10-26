import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';

@Module({
  controllers: [WishesController],
  providers: [WishesService],
})
// eslint-disable-next-line prettier/prettier
export class WishesModule { }
