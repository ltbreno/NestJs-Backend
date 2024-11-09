import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Tech Corp', description: 'The name of the company' })
  name: string;

  @ApiProperty({ example: 'Technology', description: 'Category of the company' })
  category: string;

  @ApiProperty({ example: '1234 Tech Street', description: 'Address of the company' })
  address: string;
}
