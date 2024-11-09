import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category/category';
import { CategoryService } from './category.service';


@Module({
  imports: [TypeOrmModule.forFeature([Category])], // Registra o repositório de Category
  providers: [CategoryService],
  exports: [TypeOrmModule], // Exporta o TypeOrmModule para que o repositório seja acessível em outros módulos
})
export class CategoryModule {}
