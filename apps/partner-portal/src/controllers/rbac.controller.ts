import { Body, Controller, Get, Post, Query, Req, Res, Param, Put, Delete } from '@nestjs/common';
import { LibraryService, NoLogin, PaginationDto, RbacService } from '@lib';
import { ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { LoginDto } from '../dtos/login.dto';
import { CreateRoleDto, UpdateRoleDto } from '../dtos/role.dto';
import { AuthService } from '../services/auth.service';

@Controller()
export class RbacController {
    constructor(
        private readonly libraryService: LibraryService,
        private readonly rbacService: RbacService,
        private readonly authService: AuthService,
    ) { }

    @ApiOperation({
        summary: 'List Module',
        description: 'List all available Module'
    })
    @Get('modules')
    async listModules(@Query() pg: PaginationDto) {
        return this.rbacService.moduleList(pg)
    }
    @ApiOperation({
        summary: 'List Permission',
        description: 'List all available Permission'
    })
    @Get('permissions')
    async listPermissions(@Query() pg: PaginationDto) {
        return this.rbacService.permissionList(pg)
    }

    // ROLE
    @ApiOperation({
        summary: 'List Role',
        description: 'List all available Role'
    })
    @Get('roles')
    async listRoles(@Query() pg: PaginationDto) {
        return this.rbacService.roleList(pg)
    }

    @ApiOperation({
        summary: 'Create Role',
        description: 'Create a new role'
    })
    @Post('roles')
    async createRole(@Body() createRoleDto: CreateRoleDto) {
        return this.rbacService.createRole(createRoleDto)
    }

    @ApiOperation({
        summary: 'Get Role by ID',
        description: 'Retrieve a specific role by its ID'
    })
    @Get('roles/:id')
    async getRoleById(@Param('id') id: number) {
        return this.rbacService.getRoleById(id)
    }

    @ApiOperation({
        summary: 'Update Role',
        description: 'Update an existing role by its ID'
    })
    @Post('roles/:id')
    async updateRole(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
        return this.rbacService.updateRole(id, updateRoleDto)
    }

    @ApiOperation({
        summary: 'Delete Role',
        description: 'Delete a role by its ID'
    })
    @Delete('roles/:id')
    async deleteRole(@Param('id') id: number) {
        return this.rbacService.deleteRole(id)
    }

}
