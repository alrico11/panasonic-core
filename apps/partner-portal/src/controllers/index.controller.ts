import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { LibraryService, NoLogin, PaginationDto, RbacService } from '@lib';
import { ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { LoginDto } from '../dtos/login.dto';
import { AuthService } from '../services/auth.service';

@Controller()
export class IndexController {
    constructor(
        private readonly libraryService: LibraryService,
        private readonly rbacService: RbacService,
        private readonly authService: AuthService,
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

    @Get('login')
    @ApiOperation({
        description: "Check login status"
    })
    getAuth(@Req() req: Request) {
        return req.token
    }

    @Get('logout')
    @ApiOperation({
        description: "Check login status"
    })
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });
        return res.json({ success: true });
    }

    @Post('login')
    @NoLogin()
    @ApiOperation({
        description: "Do login using email and password"
    })
    login(@Body() payload: LoginDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.login(payload.email, payload.password).then(
            ({ token, user, partnerUser, expiresIn }) => {
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    path: '/',
                    maxAge: expiresIn
                })
                return { user, partnerUser, expiresIn }
            }
        )
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
    @Get('modules')
    async listModules(@Query() pg: PaginationDto) {
        return this.rbacService.moduleList(pg)
    }

    @ApiOperation({
        summary: 'List Role',
        description: 'List all available Role'
    })
    @Get('roles')
    async listRoles(@Query() pg: PaginationDto) {
        return this.rbacService.roleList(pg)
    }

    @ApiOperation({
        summary: 'List Role',
        description: 'List all available Role'
    })
    @Get('permissions')
    async listPermissions(@Query() pg: PaginationDto) {
        return this.rbacService.permissionList(pg)
    }
}
