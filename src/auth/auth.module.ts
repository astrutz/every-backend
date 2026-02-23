import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiKeyAuthGuard } from './api-key.guard';

@Module({
  imports: [ConfigModule],
  providers: [ApiKeyAuthGuard],
  exports: [ApiKeyAuthGuard],
})
export class AuthModule {}