import { Body, Controller, Get, Post } from '@nestjs/common';
import { WorkOrderService, CreateWorkOrderDto } from '@lib';

@Controller('work-orders')
export class WorkOrderController {
    constructor(private readonly workOrderService: WorkOrderService) {}

    /**
     * Create a new work order
     * POST /work-orders
     */
    @Post()
    // @Action('create') // TODO: set authorization
    async create(@Body() createWorkOrderDto: CreateWorkOrderDto) {
        const workOrder = await this.workOrderService.create(createWorkOrderDto);
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
}