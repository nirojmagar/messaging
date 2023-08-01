import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}

    @Post('/login')
    login(@Body() loginData){
        if ( !this.authService.verifyLoginCredential(loginData.email, loginData.password) ) {
            throw new UnauthorizedException();
        }
        return this.authService.createToken(loginData.email)
    }

    @UseGuards(AuthGuard)
    @Get('/profile')
    profile(@Req() request){
        return request.user
    }
}
