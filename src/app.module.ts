import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LibraryModule } from 'cakrawala-hub-library-api';

@Module({
    imports: [LibraryModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
