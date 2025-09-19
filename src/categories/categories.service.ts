import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto) {
    const exists = await this.categoryRepo.findOne({ where: { name: dto.name } });
    if (exists) throw new ConflictException('Category name must be unique');
    const category = this.categoryRepo.create(dto);
    return this.categoryRepo.save(category);
  }

  async findAll() {
    // Return categories with a computed productCount field
    const qb = this.categoryRepo.createQueryBuilder('category');
    qb.loadRelationCountAndMap('category.productCount', 'category.products');
    return qb.getMany();
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findOne({ where: { id }, relations: ['products'] });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    Object.assign(category, dto);
    return this.categoryRepo.save(category);
  }

  async remove(id: number) {
    const category = await this.categoryRepo.findOne({ where: { id }, relations: ['products'] });
    if (!category) throw new NotFoundException('Category not found');
    if (category.products && category.products.length > 0) {
      // Respond with 409 Conflict when linked products exist
      throw new ConflictException('Cannot delete category with linked products');
    }
    await this.categoryRepo.remove(category);
    return { message: 'Category deleted' };
  }
}
