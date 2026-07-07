import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty({ message: 'Customer number is required' })
  @IsString()
  @MaxLength(50, { message: 'Customer number cannot exceed 50 characters' })
  customerNumber: string;

  @IsNotEmpty({ message: 'Customer name is required' })
  @IsString()
  @MaxLength(255, { message: 'Customer name cannot exceed 255 characters' })
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Phone number cannot exceed 50 characters' })
  phone?: string;
}
