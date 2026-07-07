import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'CUST-001', description: 'Unique customer number' })
  @IsNotEmpty({ message: 'Customer number is required' })
  @IsString()
  @MaxLength(50, { message: 'Customer number cannot exceed 50 characters' })
  customerNumber: string;

  @ApiProperty({ example: 'Rahul Sharma', description: 'Customer full name' })
  @IsNotEmpty({ message: 'Customer name is required' })
  @IsString()
  @MaxLength(255, { message: 'Customer name cannot exceed 255 characters' })
  name: string;

  @ApiProperty({ example: 'rahul.sharma@example.com', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @ApiProperty({ example: '+91-98765-43210', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Phone number cannot exceed 50 characters' })
  phone?: string;
}
