import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateOfferDto {
  @ApiProperty({ description: 'The ID of the User making the offer' })
  userId: number;

  @ApiProperty({ description: 'The ID of the Wish being offered on' })
  wishId: number;

  @ApiProperty({ description: 'The amount of the offer', default: 0 })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({
    description: 'Whether the offer is hidden or not',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  hidden?: boolean = false;
}
