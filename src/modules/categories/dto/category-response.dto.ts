import { Expose } from 'class-transformer';

export class CategoryResponseDto {
  @Expose()
  name: string;

  @Expose()
  description: string;
}
