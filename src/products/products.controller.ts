import { Controller, Post, Get, Put, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiQuery } from '@nestjs/swagger';
import { SuccessMessage } from '../common/decorators/success-message.decorator';

@ApiTags('products')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden' })
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiBadRequestResponse({ description: 'Bad Request' })
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  @SuccessMessage('Product created successfully')
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @SuccessMessage('Products fetched successfully')
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('search')
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @SuccessMessage('Products search results fetched successfully')
  search(@Query() query: any) {
    return this.productsService.search(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  @SuccessMessage('Product fetched successfully')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @SuccessMessage('Product updated successfully')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @SuccessMessage('Product deleted successfully')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
