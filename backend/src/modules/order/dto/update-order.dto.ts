import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsUUID,
  IsDate,
  IsArray,
  IsNumber,
  IsInt,
  Min,
  Max,
  ValidateNested,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order.dto';

export class UpdateOrderDto {
  @ApiProperty({ example: 'uuid', required: false })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiProperty({ example: '2026-07-15', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  orderDate?: Date;

  @ApiProperty({ example: 3, required: false, description: 'Order status ID' })
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Order status ID must be between 1 and 4' })
  @Max(4, { message: 'Order status ID must be between 1 and 4' })
  orderStatusId?: number;

  @ApiProperty({ example: 5000.0, required: false })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Tax amount must be a valid number' },
  )
  @Min(0, { message: 'Tax amount cannot be negative' })
  taxAmount?: number;

  @ApiProperty({ example: 0.0, required: false })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Discount amount must be a valid number' },
  )
  @Min(0, { message: 'Discount amount cannot be negative' })
  discountAmount?: number;

  @ApiProperty({ example: 'Updated order notes', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Order notes cannot exceed 500 characters' })
  notes?: string;

  @ApiProperty({ type: [CreateOrderItemDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items?: CreateOrderItemDto[];
}
