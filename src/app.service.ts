import { Injectable } from '@nestjs/common';
import { LibraryService } from 'cakrawala-hub-library-api';

@Injectable()
export class AppService {
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
