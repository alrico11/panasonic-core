import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { LibraryService, NoLogin, PaginationDto, RbacService } from '@lib';
import { ApiOperation } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { LoginDto } from 'apps/partner-portal/src/dtos/login.dto';
import { AuthService } from '../services/auth.service';

@Controller()
export class IndexController {
    constructor(
        private readonly libraryService: LibraryService,
        private readonly authService: AuthService,
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

    @Get('library-data')
    @NoLogin()
    getLibraryData(): object {
        return {
            data: this.libraryService.getSampleData(),
            info: this.libraryService.getLibraryInfo()
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
        description: "Do login using email or phone number with OTP"
    })
    login(@Body() payload: LoginDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.login(payload).then(
            ({ token, user, customers, expiresIn }) => {
                // res.cookie('token', token, {
                //     httpOnly: true,
                //     secure: process.env.NODE_ENV === 'production',
                //     sameSite: 'lax',
                //     path: '/',
                //     maxAge: expiresIn
                // })
                // return { user, customers, expiresIn }
            }
        )
    }
}
