import { Injectable } from '@nestjs/common';

@Injectable()
export class PartnerPortalService {
  getHello(): string {
    return 'Hello World!';
  }
}
