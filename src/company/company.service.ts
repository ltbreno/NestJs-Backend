// src/company/company.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../company/entities/company';
import { Review } from '../review/entities/review/review';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>
  ) {}

  async createCompany(name: string, category: string, address: string): Promise<Company> {
    const newCompany = this.companyRepository.create({ name, category, address });
    return await this.companyRepository.save(newCompany);
  }

  async getAllCompaniesWithRatings(): Promise<any[]> {
    const companies = await this.companyRepository.find({ relations: ['reviews'] });

    return companies.map(company => {
      const totalReviews = company.reviews.length;
      const averageRating = totalReviews > 0
        ? company.reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews
        : null;

      return {
        ...company,
        averageRating,
        totalReviews
      };
    });
  }

  async reviewCompany(companyId: string, reviewerId: string, rating: number): Promise<Review> {
    const company = await this.companyRepository.findOne({ where: { id: companyId } });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const existingReview = await this.reviewRepository.findOne({
      where: { company: { id: companyId }, reviewerId },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this company');
    }

    const newReview = this.reviewRepository.create({
      rating,
      company,
      reviewerId,
      comment: null
    });

    return await this.reviewRepository.save(newReview);
  }
}
