import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';
import cookieParser from 'cookie-parser';
import { Socket } from 'socket.io';

@Injectable()
export class WsGuard  implements CanActivate  {
  private logger = new Logger('GUARD');

  constructor(private jwtService: JwtService, private confiService: ConfigService) {
    //
  }

  async canActivate(context: ExecutionContext) {
    let client: Socket = context.switchToWs().getClient();
    const token = this.extractJWTFromCookie(client);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.confiService.get<string>('JWT_SECRET'),
        issuer: this.confiService.get<string>('JWT_ISSUER'),
        audience: this.confiService.get<string>('JWT_AUDIENCE'),
      });
      client['user'] = {email:payload.sub};
    } catch {
      throw new WsException('Unauthorized')
    }
    return true;
  }

  private extractJWTFromCookie(client: Socket): string | null {
    try {
      const cookie = JSON.parse(client?.handshake?.headers?.cookie)
      return cookie?.token
    } catch(e) {
      console.log(e.message)
      return null
    }
  }

  handleRequest(err, user, info) {
    console.log(err, user.info)
    if (Array.isArray(info)&&info.length) {
      this.logger.warn(`JWT error ${info[0].message}`);
    } else if( info ){
      this.logger.warn(`JWT error ${info.message}`);
    }
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
  
}
