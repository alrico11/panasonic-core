import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { InterceptorResponse, LibraryService, NoLogin, PaginationDto, RbacService } from '@lib';
import { ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { ForgotPasswordCheckDto, ForgotPasswordDto, ForgotPasswordRequestDto, LoginDto } from '../dtos/login.dto';
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
        return this.authService.login(payload.email, payload.password, payload.remember).then(
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

    @Post('reset-password/request')
    @NoLogin()
    @ApiOperation({
        description: "Do send email that contain forgot password code/link"
    })
    forgotPasswordRequest(@Body() payload: ForgotPasswordRequestDto) {
        return this.authService.forgotPassword(payload.email).then(
            () => {
                return new InterceptorResponse('Email will be sent if account exists.')
            }
        )
    }

    @Post('reset-password/check')
    @NoLogin()
    @ApiOperation({
        description: "Check forgot password code/link"
    })
    forgotPasswordCheck(@Body() payload: ForgotPasswordCheckDto) {
        return this.authService.checkForgotPasswordCode(payload.code).then(
            () => {
                return new InterceptorResponse('Ok code exists.', undefined, 200)
            }
        )
    }

    @Post('reset-password/set')
    @NoLogin()
    @ApiOperation({
        description: "Set password from reset password code/link"
    })
    forgotPasswordSet(@Body() payload: ForgotPasswordDto) {
        return this.authService.resetPassword(payload.code, payload.password).then(
            () => {
                return new InterceptorResponse('Ok password changed.')
            }
        )
    }
}
