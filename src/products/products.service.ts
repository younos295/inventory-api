import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindManyOptions, ILike } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from '../categories/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateProductDto) {
    const category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
    if (!category) throw new BadRequestException('Invalid category');
    const product = this.productRepo.create({ ...dto, category });
    return this.productRepo.save(product);
  }

  async findAll(query: any) {
    const { categoryId, minPrice, maxPrice, page = 1, limit = 10 } = query;
    const where: any = {};
    if (categoryId) where.category = { id: categoryId };
    if (minPrice && maxPrice) where.price = Between(minPrice, maxPrice);
    const options: FindManyOptions<Product> = {
      where,
      relations: ['category'],
      skip: (page - 1) * limit,
      take: limit,
    };
    return this.productRepo.find(options);
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({ where: { id }, relations: ['category'] });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    if (dto.categoryId) {
      const category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
      if (!category) throw new BadRequestException('Invalid category');
      product.category = category;
    }
    Object.assign(product, dto);
    return this.productRepo.save(product);
  }

  async remove(id: number) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    await this.productRepo.remove(product);
    return { message: 'Product deleted' };
  }

  async search(query: any) {
    const { q, page = 1, limit = 10 } = query;
    if (!q) return [];
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    return this.productRepo.find({
      where: [
        { name: ILike(`%${q}%`) },
        { description: ILike(`%${q}%`) },
      ],
      relations: ['category'],
      skip: (pageNum - 1) * limitNum,
      take: limitNum,
    });
  }
}
