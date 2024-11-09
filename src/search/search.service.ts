import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from '../user/entities/user';
import { Company } from '../company/entities/company';
import { SearchHistory } from './entities/search-history/search-history';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Company)
    private companyRepository: Repository<Company>,

    @InjectRepository(SearchHistory)
    private searchHistoryRepository: Repository<SearchHistory>,
  ) {}

  async searchUsers(q: string, category: string): Promise<User[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.reviewsReceived', 'reviews')
      .leftJoinAndSelect('user.favoritesReceived', 'favorites');

    if (q) {
      queryBuilder.andWhere('user.name ILIKE :name', { name: `%${q}%` });
    }

    if (category && category.toUpperCase() !== 'ANY') {
      queryBuilder
        .leftJoinAndSelect('user.categories', 'category')
        .andWhere('category.name = :category', { category: category.toUpperCase() });
    }
  
    return await queryBuilder.getMany();
  }

  async searchCompanies(q: string, category: string): Promise<Company[]> {
    return await this.companyRepository.find({
      where: [
        { name: ILike(`%${q || ''}%`) },
        ...(category && category.toUpperCase() !== 'ANY'
          ? [{ category: category.toUpperCase() }]
          : [])
      ],
      relations: ['users'], // Adjust relationships if necessary
    });
  }

  async logSearchHistory(userId: string, q: string, category: string, type: string): Promise<SearchHistory> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    const searchHistory = this.searchHistoryRepository.create({
      user,
      query: q || null,
      category: category || null,
      type,
    });

    return await this.searchHistoryRepository.save(searchHistory);
  }

  async getSearchHistory(userId: string): Promise<{ id: string; query: string }[]> {
    const searchHistory = await this.searchHistoryRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      take: 3,
    });

    const uniqueSearches = [];
    const seenQueries = new Set<string>();

    for (const item of searchHistory) {
      if (item.query && !seenQueries.has(item.query)) {
        uniqueSearches.push({ id: item.id, query: item.query });
        seenQueries.add(item.query);
      }
    }

    return uniqueSearches;
  }

  async deleteSearchHistoryById(userId: string, searchEntry: { query: string }): Promise<void> {
    await this.searchHistoryRepository.delete({
      query: searchEntry.query,
      user: { id: userId },
    });
  }

  async findSearchHistoryById(id: string): Promise<SearchHistory> {
    return await this.searchHistoryRepository.findOne({ where: { id } });
  }
}
