import {
  IsNotEmpty,
  IsUUID,
  IsDate,
  IsOptional,
  IsArray,
  IsNumber,
  Min,
  ValidateNested,
  IsString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderItemDto {
  @IsNotEmpty({ message: 'Product ID is required' })
  @IsUUID()
  productId: string;

  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;

  @IsNotEmpty({ message: 'Unit price is required' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Unit price must be a valid number' },
  )
  @Min(0, { message: 'Unit price cannot be negative' })
  unitPrice: number;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Item notes cannot exceed 255 characters' })
  notes?: string;
}

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Customer ID is required' })
  @IsUUID()
  customerId: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  orderDate?: Date;

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

  @IsArray()
  @IsNotEmpty({ message: 'At least one order item is required' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
