import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from '../users/entities/user.entity';
import { Wish } from './entities/wish.entity';

@ApiTags('wishes')
@ApiBearerAuth()
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new wish' })
  @ApiResponse({ status: 201, description: 'Wish created', type: Wish })
  @ApiBody({ type: CreateWishDto })
  async createWish(@Body() createWishDto: CreateWishDto,
    @Request() req: Request & { user: User }) {
    return this.wishesService.create(createWishDto, req.user.id);
  }

  @Get('/last')
  @ApiOperation({ summary: 'Get the most recent wishes' })
  @ApiResponse({ status: 200, description: 'Recent wishes retrieved', type: [Wish] })
  async getLastWishes(): Promise<Wish[]> {
    return this.wishesService.getRecentWishes();
  }


  @Get('/top')
  @ApiOperation({ summary: 'Get the most popular wishes' })
  @ApiResponse({ status: 200, description: 'Popular wishes retrieved', type: [Wish] })
  async getPopularWishes(): Promise<Wish[]> {
    return this.wishesService.getPupularWishes();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a wish by ID' })
  @ApiResponse({ status: 200, description: 'Wish retrieved', type: Wish })
  @ApiParam({ name: 'id', description: 'ID of the wish' })
  async findWishById(@Param('id') id: string) {
    return this.wishesService.getWishInfo(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a wish by ID' })
  @ApiResponse({ status: 200, description: 'Wish updated', type: Wish })
  @ApiParam({ name: 'id', description: 'ID of the wish to update' })
  @ApiBody({ type: UpdateWishDto })
  async updateWish(@Param('id') id: string,
    @Body() updateWishDto: UpdateWishDto,
    @Request() req: Request & { user: User }
  ) {
    return this.wishesService.update(+id, updateWishDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a wish by ID' })
  @ApiResponse({ status: 204, description: 'Wish deleted' })
  @ApiParam({ name: 'id', description: 'ID of the wish to delete' })
  async remove(@Param('id') id: string,
    @Request() req: Request & { user: User }) {
    return this.wishesService.remove(+id, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/copy')
  @ApiOperation({ summary: 'Copy a wish by ID' })
  @ApiResponse({ status: 201, description: 'Wish copied', type: Wish })
  @ApiParam({ name: 'id', description: 'ID of the wish to copy' })
  async copyWish(@Param('id') wishId: string,
    @Request() req: Request & { user: User }): Promise<Wish> {
    return this.wishesService.copyWish(+wishId, req.user.id);
  }

  @Get('/search')
  @ApiOperation({ summary: 'Search for wishes by description or name' })
  @ApiResponse({ status: 200, description: 'Wishes found', type: [Wish] })
  @ApiParam({ name: 'description', required: false, description: 'Search wishes by description' })
  @ApiParam({ name: 'name', required: false, description: 'Search wishes by name' })
  async findWishes(
    @Query('description') description: string,
    @Query('name') name: string
  ): Promise<Wish[]> {
    if (description) {
      return this.wishesService.searchWishesByDescription(description);
    }
    if (name) {
      return this.wishesService.searchWishesByName(name);
    } else {
      return [];
    }
  }

}

