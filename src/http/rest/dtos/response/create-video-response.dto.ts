import { Expose } from 'class-transformer';
import { IsDate, IsString, IsUUID } from 'class-validator';

export class CreateVideoResponseDto {
  @IsUUID()
  @Expose()
  id: string;

  @IsString()
  @Expose()
  title: string;

  @IsString()
  @Expose()
  description: string;

  @IsString()
  @Expose()
  url: string;

  @IsDate()
  @Expose()
  createdAt: Date;

  @IsDate()
  @Expose()
  updatedAt: Date;
}
