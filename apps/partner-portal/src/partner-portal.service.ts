import { Injectable } from '@nestjs/common';
import { LibraryService } from '@lib';

@Injectable()
export class PartnerPortalService {
  constructor(private readonly libraryService: LibraryService) { }

  getHello(): object {
    return {
      message: 'Welcome to Partner Portal API',
      port: 4002,
      libraryInfo: this.libraryService.getLibraryInfo(),
    };
  }

  getLibraryData(): object {
    return {
      source: 'cakrawala-hub-library-api',
      data: this.libraryService.getSampleData(),
    };
  }

  getLibraryInfo(): object {
    return this.libraryService.getLibraryInfo();
  }
}
