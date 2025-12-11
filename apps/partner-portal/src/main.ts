import { NestFactory } from '@nestjs/core';
import { PartnerPortalModule } from './partner-portal.module';

async function bootstrap() {
  const app = await NestFactory.create(PartnerPortalModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
