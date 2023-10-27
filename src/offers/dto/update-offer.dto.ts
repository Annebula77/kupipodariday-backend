import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class UpdateOfferDto {
  @ApiPropertyOptional({ description: 'The ID of the User making the offer' })
  userId?: number;

  @ApiPropertyOptional({ description: 'The ID of the Wish being offered on' })
  wishId?: number;

  @ApiPropertyOptional({ description: 'The amount of the offer' })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiPropertyOptional({ description: 'Whether the offer is hidden or not' })
  @IsBoolean()
  @IsOptional()
  hidden?: boolean;
}
