import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}

    @Post('/login')
    async login(@Body() loginData, @Res() res: Response){
        if ( !this.authService.verifyLoginCredential(loginData.email, loginData.password) ) {
            throw new UnauthorizedException();
        }
        const token = await this.authService.createToken(loginData.email)
        return res.cookie('token', token, {
            // httpOnly: true,
            secure: false,
            sameSite: 'lax',
            expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
        }).send({token});
    }

    @UseGuards(AuthGuard)
    @Get('/profile')
    profile(@Req() request){
        return request.user
    }
}
