import { IsString, IsEmail, IsOptional, MaxLength } from 'class-validator';
import { CreateCustomerDto } from './create-customer.dto';

export class UpdateCustomerDto implements Partial<CreateCustomerDto> {
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Customer number cannot exceed 50 characters' })
  customerNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Customer name cannot exceed 255 characters' })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Phone number cannot exceed 50 characters' })
  phone?: string;
}
