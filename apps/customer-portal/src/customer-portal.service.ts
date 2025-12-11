import { Injectable } from '@nestjs/common';
import { LibraryService } from '@lib';

@Injectable()
export class CustomerPortalService {
  constructor(private readonly libraryService: LibraryService) { }
  getWelcome(): object {
    return {
      message: 'Welcome to Customer Portal API',
      port: 4001,
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
