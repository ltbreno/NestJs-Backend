import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { User } from "src/user/entities/user";
import { Favorite } from './entities/favorite/favorite';

@Module({
  imports: [TypeOrmModule.forFeature([User, Favorite])],
  providers: [FavoritesService],
  controllers: [FavoritesController],
})
export class FavoritesModule {}
