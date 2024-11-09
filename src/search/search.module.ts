import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { Company } from '../company/entities/company';
import { SearchHistory } from './entities/search-history/search-history';
import { User } from 'src/user/entities/user';

@Module({
  imports: [TypeOrmModule.forFeature([User, Company, SearchHistory])], // Importa as entidades necessárias
  providers: [SearchService], 
  controllers: [SearchController], 
  exports: [SearchService],
})
export class SearchModule {}
;
