import { IsNotEmpty, IsString, IsOptional, IsNumber, MaxLength, Min } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto implements Partial<CreateProductDto> {
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Product code cannot exceed 50 characters' })
  productCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Product name cannot exceed 255 characters' })
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'Price must be a valid number' },
  )
  @Min(0, { message: 'Price cannot be negative' })
  basePrice?: number;

  @IsOptional()
  isActive?: boolean;
}
