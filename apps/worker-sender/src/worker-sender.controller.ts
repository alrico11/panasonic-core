import { Controller, Get } from '@nestjs/common';
import { WorkerSenderService } from './worker-sender.service';
// Controller kept only for simple HTTP health/hello route.

@Controller()
export class WorkerSenderController {
  constructor(private readonly workerSenderService: WorkerSenderService) {}

  @Get()
  getHello(): string {
    return this.workerSenderService.getHello();
  }

  // Event patterns handled in dedicated controllers to prevent duplicate consumers.
}
