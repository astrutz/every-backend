import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyAuthGuard.name);

  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const path: string = request.path || request.url || '';
    const method: string = request.method;

    if (path === '/health' || path === '/') {
      return true;
    }

    const configuredKey = this.configService.get<string>('API_KEY');

    if (!configuredKey || configuredKey.trim().length === 0) {
      this.logger.warn('No API_KEY configured — skipping API key validation');
      return true;
    }

    const headerKey =
      (request.headers['x-api-key'] as string) ||
      (request.headers['authorization'] as string && request.headers['authorization'].replace(/^Bearer\s+/i, '')) ||
      '';

    if (!headerKey) {
      this.logger.warn(`Missing API key for ${method} ${path}`);
      return false;
    }

    const valid = headerKey === configuredKey;
    if (!valid) {
      this.logger.warn(`Invalid API key for ${method} ${path}`);
    }
    return valid;
  }
}