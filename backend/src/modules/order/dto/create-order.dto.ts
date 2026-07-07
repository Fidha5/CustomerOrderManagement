import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'uuid', description: 'Product ID' })
  @IsNotEmpty({ message: 'Product ID is required' })
  @IsUUID()
  productId: string;

  @ApiProperty({ example: 2, description: 'Quantity of the product' })
  @IsNotEmpty({ message: 'Quantity is required' })
  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity: number;

  @ApiProperty({ example: 50000.0, description: 'Unit price' })
  @IsNotEmpty({ message: 'Unit price is required' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Unit price must be a valid number' },
  )
  @Min(0, { message: 'Unit price cannot be negative' })
  unitPrice: number;

  @ApiProperty({ example: 'Custom configuration', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Item notes cannot exceed 255 characters' })
  notes?: string;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'uuid', description: 'Customer ID' })
  @IsNotEmpty({ message: 'Customer ID is required' })
  @IsUUID()
  customerId: string;

  @ApiProperty({
    example: '2026-07-15',
    required: false,
    description: 'Order date',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  orderDate?: Date;

  @ApiProperty({ example: 5000.0, required: false, description: 'Tax amount' })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Tax amount must be a valid number' },
  )
  @Min(0, { message: 'Tax amount cannot be negative' })
  taxAmount?: number;

  @ApiProperty({
    example: 0.0,
    required: false,
    description: 'Discount amount',
  })
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Discount amount must be a valid number' },
  )
  @Min(0, { message: 'Discount amount cannot be negative' })
  discountAmount?: number;

  @ApiProperty({ example: 'Annual renewal order', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Order notes cannot exceed 500 characters' })
  notes?: string;

  @ApiProperty({ type: [CreateOrderItemDto], description: 'Order items' })
  @IsArray()
  @IsNotEmpty({ message: 'At least one order item is required' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
