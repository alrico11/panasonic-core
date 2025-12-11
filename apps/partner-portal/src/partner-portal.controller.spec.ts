import { Test, TestingModule } from '@nestjs/testing';
import { PartnerPortalController } from './partner-portal.controller';
import { PartnerPortalService } from './partner-portal.service';

describe('PartnerPortalController', () => {
  let partnerPortalController: PartnerPortalController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PartnerPortalController],
      providers: [PartnerPortalService],
    }).compile();

    partnerPortalController = app.get<PartnerPortalController>(PartnerPortalController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(partnerPortalController.getHello()).toBe('Hello World!');
    });
  });
});
