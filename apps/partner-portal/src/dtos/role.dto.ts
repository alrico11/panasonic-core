import { IsString, IsOptional, IsBoolean, IsArray, IsInt } from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: 'Slug must be a string' })
  slug: string;

  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'IsAdmin must be a boolean' })
  isAdmin?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'IsArea must be a boolean' })
  isArea?: boolean;

  @IsOptional()
  @IsArray({ message: 'Permissions must be an array' })
  @IsInt({ each: true, message: 'Each permission must be an integer' })
  permissions?: number[];

  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean' })
  status?: boolean;
}

export class UpdateRoleDto {
  @IsOptional()
  @IsString({ message: 'Slug must be a string' })
  slug?: string;

  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsBoolean({ message: 'IsAdmin must be a boolean' })
  isAdmin?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'IsArea must be a boolean' })
  isArea?: boolean;

  @IsOptional()
  @IsArray({ message: 'Permissions must be an array' })
  @IsInt({ each: true, message: 'Each permission must be an integer' })
  permissions?: number[];

  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean' })
  status?: boolean;
}
