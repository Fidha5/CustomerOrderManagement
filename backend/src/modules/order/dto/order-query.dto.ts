import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, IsUUID, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderQueryDto {
  @ApiProperty({ required: false, description: 'Search by order number or customer name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, description: 'Filter by customer ID' })
  @IsOptional()
  @IsUUID()
  customerId?: string;

  @ApiProperty({ required: false, description: 'Filter by order status ID' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(4)
  statusId?: number;

  @ApiProperty({ required: false, description: 'Filter by date from' })
  @IsOptional()
  @IsString()
  dateFrom?: string;

  @ApiProperty({ required: false, description: 'Filter by date to' })
  @IsOptional()
  @IsString()
  dateTo?: string;

  @ApiProperty({ required: false, default: 1, description: 'Page number' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 20, description: 'Items per page' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}