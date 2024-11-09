import { Controller, Get, Post, Body, Param, Query, Delete, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { SearchService } from './search.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() 
  @Get('users')
  @ApiOperation({ summary: 'Search for users by name and category' })
  @ApiQuery({ name: 'q', required: false, description: 'Query string for searching by user name' })
  @ApiQuery({ name: 'category', required: false, description: 'Category to filter users' })
  @ApiResponse({ status: 200, description: 'Returns a list of users' })
  async searchUsers(@Query('q') q: string, @Query('category') category: string) {
    return this.searchService.searchUsers(q, category);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('companies')
  @ApiOperation({ summary: 'Search for companies by name and category' })
  @ApiQuery({ name: 'q', required: false, description: 'Query string for searching by company name' })
  @ApiQuery({ name: 'category', required: false, description: 'Category to filter companies' })
  @ApiResponse({ status: 200, description: 'Returns a list of companies' })
  async searchCompanies(@Query('q') q: string, @Query('category') category: string) {
    return this.searchService.searchCompanies(q, category);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('history')
  @ApiOperation({ summary: 'Log search history' })
  @ApiBody({ description: 'Search data to log', schema: { example: { q: 'query', category: 'category', type: 'user' } } })
  @ApiResponse({ status: 201, description: 'Logs the search query to the search history' })
  async logSearchHistory(@Request() req, @Body() body: { q: string; category: string; type: string }) {
    const userId = req.user.userId; 
    const { q, category, type } = body;
    return this.searchService.logSearchHistory(userId, q, category, type);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('history')
  @ApiOperation({ summary: 'Get recent search history of a user' })
  @ApiResponse({ status: 200, description: 'Returns the search history of the user' })
  async getSearchHistory(@Request() req) {
    const userId = req.user.userId; 
    return this.searchService.getSearchHistory(userId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('history/:id')
  @ApiOperation({ summary: 'Delete a search entry by ID' })
  @ApiParam({ name: 'id', description: 'ID of the search entry to delete' })
  @ApiResponse({ status: 200, description: 'Deletes the search history entry' })
  async deleteSearchHistoryById(@Request() req, @Param('id') id: string) {
    const userId = req.user.userId;  // Extraímos o userId do token JWT
    const searchEntry = await this.searchService.findSearchHistoryById(id);
    if (!searchEntry) {
      throw new NotFoundException('Search history not found');
    }
    return this.searchService.deleteSearchHistoryById(userId, { query: searchEntry.query });
  }
}