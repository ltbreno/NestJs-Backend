import { Controller, Post, Delete, Param, Get, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

@ApiTags('favorites')
@ApiBearerAuth()
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':favoriteId')
  @ApiOperation({ summary: 'Add a favorite user' }) 
  @ApiParam({ name: 'favoriteId', type: 'string', description: 'ID of the favorite user to be added' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Favorite added successfully.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input or the user is already a favorite.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User or favorite not found.' })
  async addFavorite(@Request() req, @Param('favoriteId') favoriteId: string) {
    const userId = req.user.userId; 
    return this.favoritesService.addFavorite(userId, favoriteId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':favoriteId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a favorite user' })
  @ApiParam({ name: 'favoriteId', type: 'string', description: 'ID of the favorite user to be removed' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Favorite removed successfully.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Favorite not found.' })
  async removeFavorite(@Request() req, @Param('favoriteId') favoriteId: string) {
    const userId = req.user.userId;
    return this.favoritesService.removeFavorite(userId, favoriteId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'List favorite users' })
  @ApiResponse({ status: HttpStatus.OK, description: 'List of favorite users returned successfully.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  async listFavorites(@Request() req) {
    const userId = req.user.userId; 
    return this.favoritesService.listFavorites(userId);
  }
}
