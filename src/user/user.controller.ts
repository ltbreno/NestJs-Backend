import { Controller, Patch, Get, UseGuards, Body, HttpCode, HttpStatus, Request, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';

import { User } from './entities/user';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @ApiOperation({ summary: 'Update the profile of the logged-in user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Profile updated successfully.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid data or user not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access.' })
  async updateUserProfile(@Request() req, @Body() updateData: Partial<User>) {
    const userId = req.user.userId; 
    return this.userService.updateUserProfile(userId, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get the profile of the logged-in user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Profile retrieved successfully.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access.' })
  async getUserProfile(@Request() req) {
    const userId = req.user.userId; 
    return this.userService.getUserProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('block/check/:targetUserId')
  @ApiOperation({ summary: 'Check if the logged-in user is blocked by or has blocked another user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Block status checked successfully.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User or block not found.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access.' })
  async checkIfBlocked(@Request() req, @Param('targetUserId') targetUserId: string) {
    const loggedInUserId = req.user.userId; 
    return this.userService.checkIfBlocked(loggedInUserId, targetUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('categories/:categoryId')
  @ApiOperation({ summary: 'Add a category to the logged-in user profile' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Category added successfully.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Category not found or user already has a category.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access.' })
  async addCategory(
    @Request() req,
    @Param('categoryId') categoryId: string
  ) {
    const userId = req.user.userId; // Extraído do JWT
    return this.userService.addCategoryToUser(userId, categoryId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('categories/:categoryId/subcategories')
  @ApiOperation({ summary: 'Add subcategories to the category of the logged-in user profile' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Subcategories added successfully.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Category or subcategories not found, or exceeded limit.' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized access.' })
  async addSubcategories(
    @Request() req,
    @Param('categoryId') categoryId: string,
    @Body() subcategoryIds: string[] // Subcategorias enviadas no corpo da requisição
  ) {
    const userId = req.user.userId; // Extraído do JWT
    return this.userService.addSubcategoriesToUser(userId, categoryId, subcategoryIds);
  }
}
