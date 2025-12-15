import { Action } from '@lib';
import { Controller, Get } from '@nestjs/common';

@Controller('customer')
export class CustomerController {
    @Get('view/id')
    @Action('view')
    getSample(): object {
        return { ok: true }
    }
}
