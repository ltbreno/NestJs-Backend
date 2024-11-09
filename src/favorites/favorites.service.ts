import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from "src/user/entities/user";
import { Favorite } from './entities/favorite/favorite';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Favorite)
    private favoritesRepository: Repository<Favorite>,
  ) {}

  async addFavorite(userId: string, favoriteId: string): Promise<void> {
    // Verificar se o usuário está tentando se favoritar
    if (userId === favoriteId) {
      throw new BadRequestException('You cannot add yourself as a favorite.');
    }

    // Verificar se o usuário existe
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // Verificar se o usuário favorito existe
    const favoriteUser = await this.usersRepository.findOne({ where: { id: favoriteId } });
    if (!favoriteUser) {
      throw new NotFoundException('Favorite user not found.');
    }

    // Verificar se o usuário já está nos favoritos
    const existingFavorite = await this.favoritesRepository.findOne({
      where: {
        user: { id: userId },
        favoriteUser: { id: favoriteId },
      },
    });

    if (existingFavorite) {
      throw new BadRequestException('This user is already in your favorites.');
    }

    // Adicionar o usuário favorito
    const favorite = this.favoritesRepository.create({
      user: user,
      favoriteUser: favoriteUser,
    });

    await this.favoritesRepository.save(favorite);
  }

  async removeFavorite(userId: string, favoriteId: string): Promise<void> {
    // Encontrar a relação de favoritos
    const favorite = await this.favoritesRepository.findOne({
      where: {
        user: { id: userId },
        favoriteUser: { id: favoriteId },
      },
    });

    if (!favorite) {
      throw new NotFoundException('This user is not in your favorites.');
    }

    // Remover o favorito
    await this.favoritesRepository.remove(favorite);
  }

  async listFavorites(userId: string): Promise<User[]> {
    // Verificar se o usuário existe
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['favorites', 'favorites.favoriteUser'],
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    // Retornar a lista de usuários favoritados
    return user.favorites.map(favorite => favorite.favoriteUser);
  }
}
