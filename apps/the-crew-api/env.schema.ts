import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class EnvironmentVariables {
  @IsNotEmpty()
  @IsNumberString()
  NX_TYPEORM_PORT = '5432';

  @IsNotEmpty()
  @IsNumberString()
  NX_PORT = '3000';

  @IsString()
  @IsNotEmpty()
  // comma separated values
  NX_COOKIE_SECRETS: string;

  @IsString()
  @IsNotEmpty()
  NX_JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  NX_JWT_ISSUER = 'nestjs';

  @IsString()
  NX_ACCESS_TOKEN_EXPIRE = '24h';

  @IsString()
  NX_REFRESH_TOKEN_EXPIRE = '7d';

  @IsString()
  NX_COOKIE_EXPIRE = '7d';

  @IsString()
  @IsNotEmpty()
  // comma separated values
  NX_CORS_ORIGINS: string;

  @IsString()
  @IsNotEmpty()
  NX_TYPEORM_DB_TYPE = 'postgres';

  @IsString()
  @IsNotEmpty()
  NX_TYPEORM_HOST = 'localhost';

  @IsString()
  @IsNotEmpty()
  NX_TYPEORM_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  NX_TYPEORM_PWD: string;

  @IsString()
  @IsNotEmpty()
  NX_TYPEORM_DB: string;

  @IsString()
  @IsNotEmpty()
  NX_STRIPE_PRIVATE_KEY: string;

  @IsNumberString()
  @IsNotEmpty()
  NX_CONVENIENCE_FEE: string;
}
