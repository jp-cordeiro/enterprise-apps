import { Expose } from 'class-transformer';
import { IsString, IsUUID } from 'class-validator';

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

  @IsString()
  @Expose()
  duration: number;

  @IsString()
  @Expose()
  createdAt: Date;

  @IsString()
  @Expose()
  updatedAt: Date;
}
