import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module'; 
import { User } from './user/entities/user'; 
import { Credentials } from './register/entities/credentials/credentials'; 
import { RegisterModule } from './register/register.module';
import { UserModule } from './user/user.module';
import { BlockModule } from './block/block.module';
import { Block } from './block/entities/block/block';
import { ReportModule } from './report/report.module';
import { Report } from './report/entities/report/report';
import { ReviewModule } from './review/review.module';
import { Review } from './review/entities/review/review';
import { FavoritesModule } from './favorites/favorites.module';
import { Favorite } from './favorites/entities/favorite/favorite';
import { CompanyModule } from './company/company.module';
import { Company } from './company/entities/company';
import { MessageModule } from './message/message.module';
import { Message } from './message/entities/message';
import { SearchModule } from './search/search.module';
import { SearchHistory } from './search/entities/search-history/search-history';
import { PhotoModule } from './photo/photo.module';
import { Photo } from './photo/entities/photo/photo';
import { PaymentModule } from './payment/payment.module';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { Category } from './category/entities/category/category';
import { Subcategory } from './subcategory/entities/subcategory/subcategory';
import { Transaction } from './payment/entities/transaction/transaction';
import { GeocodingService } from './geocoding/geocoding.service';
import { LocationService } from './location/location.service';
import { LocationController } from './location/location.controller';
import { LocationModule } from './location/location.module';
import { GeocodingModule } from './geocoding/geocoding.module';
import { LocationEntity } from './location/entities/location.entity';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from './schedule/schedule.module';
import { Schedule } from './schedule/entities/schedule';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forRoot({
      type: 'postgres', 
      host: 'localhost',
      port: 5432, 
      username: 'postgres', 
      password: 'admin', 
      database: 'samba', // seu banco de dados
      entities: [User, Credentials, Block, Report, Review, Favorite, Company, Message, SearchHistory, Photo, Category, Subcategory, Transaction, LocationEntity, Schedule ], 
      synchronize: true, // Apenas para desenvolvimento (evitar em produção)
    }),
    TypeOrmModule.forFeature([User, Credentials, Block, Report, Review, Favorite, Company, Message, SearchHistory, Photo, Category, Subcategory, Transaction, LocationEntity, Schedule]), 
    AuthModule,
    RegisterModule,
    UserModule,
    BlockModule,
    ReportModule,
    ReviewModule,
    FavoritesModule,
    CompanyModule,
    MessageModule,
    SearchModule,
    PhotoModule,
    PaymentModule,
    CategoryModule,
    SubcategoryModule,
    LocationModule,
    GeocodingModule,
    ScheduleModule,
  
  ],
  controllers: [LocationController],
  providers: [GeocodingService, LocationService],
})
export class AppModule {}
