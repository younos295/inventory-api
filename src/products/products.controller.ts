import { Controller, Post, Get, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';

@ApiTags('products')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden' })
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('search')
  search(@Query('q') q: string) {
    return this.productsService.search(q);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(Number(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(Number(id), dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productsService.remove(Number(id));
  }
}
