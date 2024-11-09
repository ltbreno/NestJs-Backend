import { Module } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';

@Module({
  providers: [SubcategoryService]
})
export class SubcategoryModule {}
