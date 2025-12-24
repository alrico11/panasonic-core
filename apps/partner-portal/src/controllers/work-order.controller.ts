import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { WorkOrderService, CreateWorkOrderDto, UpdateWorkOrderDto } from '@lib';
import { Request } from 'express';

@Controller('work-orders')
export class WorkOrderController {
    constructor(private readonly workOrderService: WorkOrderService) {}

    /**
     * Create a new work order
     * POST /work-orders
     */
    @Post()
    // @Action('create') // TODO: set authorization
    async create(@Body() createWorkOrderDto: CreateWorkOrderDto, @Req() req: Request) {
        const workOrder = await this.workOrderService.create(createWorkOrderDto, req.token);
        return {
            success: true,
            message: 'Work order created successfully',
            data: workOrder, 
        };
    }

    /**
     * Retrieve all work orders
     * GET /work-orders
     */
    @Get()
    async findAll() {
        const workOrders = await this.workOrderService.findAll();
        return {
            success: true,
            message: 'Work orders retrieved successfully',
            data: workOrders,
        };
    }

    /**
     * Retrieve a work order by ID
     * GET /work-orders/:id
     */
    @Patch(':id')
    update(
        @Param('id') id: number,
        @Body() updateWorkOrderDto: UpdateWorkOrderDto,
        @Req() req: Request,
    ) {
        return this.workOrderService.update(id, updateWorkOrderDto, req.token);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req: Request) {
        console.log('req.token: ', req)
        // throw new Error('Not implemented yet');
        await this.workOrderService.softDelete(id, req.token);
        return {
            success: true,
            message: 'Work order deleted successfully',
        };
    }
}