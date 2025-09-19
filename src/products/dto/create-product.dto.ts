import { IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Smartphone' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Latest model with advanced features' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 499.99 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  stock: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  categoryId: number;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string;
}
