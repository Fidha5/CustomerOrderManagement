import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Product code is required' })
  @IsString()
  @MaxLength(50, { message: 'Product code cannot exceed 50 characters' })
  productCode: string;

  @IsNotEmpty({ message: 'Product name is required' })
  @IsString()
  @MaxLength(255, { message: 'Product name cannot exceed 255 characters' })
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty({ message: 'Base price is required' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must be a valid number' },
  )
  @Min(0, { message: 'Price cannot be negative' })
  basePrice: number;

  @IsOptional()
  isActive?: boolean;
}
