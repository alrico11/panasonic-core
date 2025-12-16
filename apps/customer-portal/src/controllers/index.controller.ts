import { Controller, Get, Query } from '@nestjs/common';
import { LibraryService, NoLogin, PaginationDto, RbacService } from '@lib';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class IndexController {
    constructor(
        private readonly libraryService: LibraryService,
        private readonly rbacService: RbacService,
    ) { }

    @Get()
    getHello() {
        return {
            service: 'customer-portal',
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
