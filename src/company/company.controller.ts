import { Controller, Post, Body, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateCompanyDto } from './dto/create-company.dto';
import { ReviewCompanyDto } from './dto/review-company.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';

@ApiTags('Companies')  
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new company' })
  @ApiResponse({ status: 201, description: 'Company created successfully.' })
  @ApiBody({ type: CreateCompanyDto })
  async createCompany(
    @Body() createCompanyDto: CreateCompanyDto
  ) {
    const { name, category, address } = createCompanyDto;
    return await this.companyService.createCompany(name, category, address);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all companies with their average ratings' })
  @ApiResponse({ status: 200, description: 'List of companies with ratings.' })
  async getAllCompaniesWithRatings() {
    return await this.companyService.getAllCompaniesWithRatings();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/review')
  @ApiOperation({ summary: 'Review a company' })
  @ApiParam({ name: 'id', description: 'ID of the company' })
  @ApiResponse({ status: 201, description: 'Review added successfully.' })
  @ApiBody({ type: ReviewCompanyDto })
  async reviewCompany(
    @Param('id', ParseIntPipe) companyId: string,
    @Body() reviewCompanyDto: ReviewCompanyDto
  ) {
    const { reviewerId, rating } = reviewCompanyDto;
    return await this.companyService.reviewCompany(companyId, reviewerId, rating);
  }
}
