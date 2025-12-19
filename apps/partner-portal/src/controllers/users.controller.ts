import { Action, PartnerService, CreatePartnerDto, UpdatePartnerDto, NoLogin, PaginationDto } from '@lib';
import { Controller, Get, Post, Body, Patch, Delete, Param, Query, ParseIntPipe, Req } from '@nestjs/common';
import { Request } from 'express'

@Controller('users')
export class UsersController {
    constructor(private readonly partnerService: PartnerService) {}

    /**
     * Get all partners
     * GET /partners
     */
    @Get()
    // @Action('list', 'partner')
    // @NoLogin()
    listAllPartners(@Req() req: Request, @Query() paginationDto: PaginationDto) {
        console.log('req.token: ', req.token)
        return this.partnerService.listAllPartners(paginationDto, req.token);
    }


    /**
     * Get partner by ID
     * GET /partners/:id
     */
    @Get(':id')
    // @NoLogin()
    // @Action('detail', 'partner')
    findOne(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
       return this.partnerService.findPartnerById(id, req.token);
    }

    /**
     * Create a new partner
     * POST /partners
     */
    @Post()
    // @NoLogin()
    // @Action('create', 'partner')
    create(@Req() req: Request, @Body() createPartnerDto: CreatePartnerDto) {
        console.log('req.token: ', req.token)
        return this.partnerService.createPartner(createPartnerDto, req.token);
    }

    /**
     * Update partner
     * PATCH /partners/:id
     */
    @Patch(':id')
    // @NoLogin()
    // @Action('edit', 'partner')
    update(
        @Req() req: Request,
        @Param('id', ParseIntPipe) id: number,
        @Body() updatePartnerDto: UpdatePartnerDto,
    ) {
        return this.partnerService.updatePartner(id, updatePartnerDto, req.token);
    }

    /**
     * Delete partner
     * DELETE /partners/:id
     */
    @Delete(':id')
    // @NoLogin()
    // @Action('delete', 'partner')
    remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
        return this.partnerService.deletePartner(id, req.token);
    }
}
