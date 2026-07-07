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
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  orderDate?: Date;

  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Order status ID must be between 1 and 4' })
  @Max(4, { message: 'Order status ID must be between 1 and 4' })
  orderStatusId?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Tax amount must be a valid number' },
  )
  @Min(0, { message: 'Tax amount cannot be negative' })
  taxAmount?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Discount amount must be a valid number' },
  )
  @Min(0, { message: 'Discount amount cannot be negative' })
  discountAmount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Order notes cannot exceed 500 characters' })
  notes?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items?: CreateOrderItemDto[];
}
