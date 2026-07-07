import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, MaxLength, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'PROD-001', description: 'Unique product code' })
  @IsNotEmpty({ message: 'Product code is required' })
  @IsString()
  @MaxLength(50, { message: 'Product code cannot exceed 50 characters' })
  productCode: string;

  @ApiProperty({ example: 'Enterprise Software License', description: 'Product name' })
  @IsNotEmpty({ message: 'Product name is required' })
  @IsString()
  @MaxLength(255, { message: 'Product name cannot exceed 255 characters' })
  name: string;

  @ApiProperty({
    example: 'Full-featured enterprise software license',
    required: false,
    description: 'Detailed product description'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 50000.00, description: 'Base price of the product' })
  @IsNotEmpty({ message: 'Base price is required' })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a valid number' })
  @Min(0, { message: 'Price cannot be negative' })
  basePrice: number;

  @ApiProperty({ example: true, required: false, description: 'Whether the product is active' })
  @IsOptional()
  isActive?: boolean;
}