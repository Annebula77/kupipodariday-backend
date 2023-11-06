import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody, ApiParam } from '@nestjs/swagger';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { Wishlist } from './entities/wishlist.entity';

@ApiTags('wishlists')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new wishlist' })
  @ApiResponse({ status: 201, description: 'The wishlist has been successfully created.', type: Wishlist })
  @ApiBody({ type: CreateWishlistDto })
  createWishlist(
    @Body() createWishlistDto: CreateWishlistDto,
    @Request() req: Request & { user: User }
  ): Promise<Wishlist> {
    return this.wishlistsService.create(createWishlistDto, req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all wishlists of the logged-in user' })
  @ApiResponse({ status: 200, description: 'Wishlists retrieved successfully.', type: [Wishlist] })
  getWishlists(@Request() req: Request & { user: User }): Promise<Wishlist[]> {
    return this.wishlistsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get wishlist by ID' })
  @ApiResponse({ status: 200, description: 'Wishlist retrieved successfully.', type: Wishlist })
  @ApiParam({ name: 'id', type: 'string', description: 'Wishlist ID' })
  getWishList(@Param('id') id: string): Promise<Wishlist> {
    return this.wishlistsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update wishlist by ID' })
  @ApiResponse({ status: 200, description: 'Wishlist updated successfully.', type: Wishlist })
  @ApiParam({ name: 'id', type: 'string', description: 'Wishlist ID' })
  @ApiBody({ type: UpdateWishlistDto })
  update(
    @Param('id') id: string,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Request() req: Request & { user: User }
  ): Promise<Wishlist> {
    return this.wishlistsService.update(+id, updateWishlistDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete wishlist by ID' })
  @ApiResponse({ status: 200, description: 'Wishlist deleted successfully.' })
  @ApiParam({ name: 'id', type: 'string', description: 'Wishlist ID' })
  remove(@Param('id') id: string, @Request() req: Request & { user: User }): Promise<void> {
    return this.wishlistsService.remove(+id, req.user.id);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search for wishlists by description or name' })
  @ApiResponse({ status: 200, description: 'Search results returned', type: [Wishlist] })
  @ApiParam({ name: 'description', type: 'string', required: false, description: 'Search by description' })
  @ApiParam({ name: 'name', type: 'string', required: false, description: 'Search by name' })
  searchFortWishlists(
    @Query('description') description: string,
    @Query('name') name: string
  ): Promise<Wishlist[]> {
    if (description) {
      return this.wishlistsService.searchWishlists(description);
    } else if (name) {
      return this.wishlistsService.searchWishlists(name);
    } else {
      return Promise.resolve([]);
    }
  }
}
