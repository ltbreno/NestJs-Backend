import { ApiProperty } from '@nestjs/swagger';

export class ReviewCompanyDto {
  @ApiProperty({ example: 5, description: 'Rating given to the company (1-5)' })
  rating: number;

  @ApiProperty({ example: 1, description: 'ID of the reviewer' })
  reviewerId: string;
}
