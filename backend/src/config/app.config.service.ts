import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL');
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET') || 'default-secret-key';
  }

  get jwtExpirationTime(): string {
    return this.configService.get<string>('JWT_EXPIRATION') || '1d';
  }

  get port(): number {
    return this.configService.get<number>('PORT') || 3000;
  }

  get frontendUrl(): string {
    return (
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173'
    );
  }
}
