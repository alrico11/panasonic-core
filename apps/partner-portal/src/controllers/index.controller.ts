import { Controller, Get, Post, Query, Req } from '@nestjs/common';
import { LibraryService, NoLogin, PaginationDto, RbacService } from '@lib';
import { ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';

@Controller()
export class IndexController {
    constructor(
        private readonly libraryService: LibraryService,
        private readonly rbacService: RbacService,
    ) { }

    @Get()
    getHello() {
        return {
            service: 'partner-portal',
            library: this.libraryService.getLibraryInfo()
        }
    }

    @Get('health')
    @NoLogin()
    getHealth(): object {
        return {
            status: 'ok'
        }
    }

    @Get('check-login')
    @ApiOperation({
        description: "Check login status"
    })
    getAuth(@Req() req: Request) {
        return req.token
    }

    @Post('login')
    @NoLogin()
    @ApiOperation({
        description: "Do login using email and password"
    })
    login() {
        // return req.token
    }

    @Get('library-data')
    @NoLogin()
    getLibraryData(): object {
        return {
            data: this.libraryService.getSampleData(),
            info: this.libraryService.getLibraryInfo()
        }
    }

    @ApiOperation({
        summary: 'List Module',
        description: 'List all available Module'
    })
    @NoLogin()
    @Get('modules')
    async listModules(@Query() pg: PaginationDto) {
        return this.rbacService.moduleList(pg)
    }

    @ApiOperation({
        summary: 'List Role',
        description: 'List all available Role'
    })
    @NoLogin()
    @Get('roles')
    async listRoles(@Query() pg: PaginationDto) {
        return this.rbacService.roleList(pg)
    }

    @ApiOperation({
        summary: 'List Role',
        description: 'List all available Role'
    })
    @NoLogin()
    @Get('permissions')
    async listPermissions(@Query() pg: PaginationDto) {
        return this.rbacService.permissionList(pg)
    }
}
