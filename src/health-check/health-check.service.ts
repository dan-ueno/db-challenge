import { Injectable } from '@nestjs/common';

const HEALTH_CHECK_MARKER = 'OK';

@Injectable()
export class AppService {
  healthCheck(): string {
    return HEALTH_CHECK_MARKER;
  }
}
