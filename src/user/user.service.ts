import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user';
import { Block } from '../block/entities/block/block';
import { Subcategory } from 'src/subcategory/entities/subcategory/subcategory';
import { Category } from 'src/category/entities/category/category';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Block) private readonly blockRepository: Repository<Block>,
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>, 
    @InjectRepository(Subcategory) private readonly subcategoryRepository: Repository<Subcategory>
  ) {}

  // Atualizar o nome do usuário
  async updateUserName(userId: string, name: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.name = name;
    return this.userRepository.save(user);
  }

  // Verificar se o usuário está bloqueado
  async checkIfBlocked(loggedInUserId: string, targetUserId: string): Promise<boolean> {
    const block = await this.blockRepository.findOne({
      where: [
        { blocker: { id: loggedInUserId }, blocked: { id: targetUserId } },
        { blocker: { id: targetUserId }, blocked: { id: loggedInUserId } },
      ],
    });

    return !!block; // Retorna true se o bloqueio existir, false se não
  }

  // Buscar o perfil do usuário
  async getUserProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // Atualizar o perfil do usuário
  async updateUserProfile(userId: string, updateData: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateData); // Atualiza os campos dinamicamente
    return this.userRepository.save(user);
  }

  async addCategoryToUser(userId: string, categoryId: string): Promise<User> {
    const user = await this.userRepository.findOne({ 
      where: { id: userId },
      relations: ['categories'],
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const category = await this.categoryRepository.findOneBy({ id: categoryId });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
  
    // Verifica o limite de categorias
    if (user.categories.length >= 1) {
      throw new UnauthorizedException('Your current plan only allows one category.');
    }
  
    user.categories.push(category);
    return this.userRepository.save(user);
  }
  
  async addSubcategoriesToUser(userId: string, categoryId: string, subcategoryIds: string[]): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['subcategories'],
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const subcategories = await this.subcategoryRepository.findByIds(subcategoryIds);
  
    // Verifica o limite de subcategorias
    if (user.subcategories.length + subcategories.length > 10) {
      throw new UnauthorizedException('You can only add up to 10 subcategories.');
    }
  
    user.subcategories.push(...subcategories);
    return this.userRepository.save(user);
  }
  

}


