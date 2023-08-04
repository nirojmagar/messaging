import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard  implements CanActivate  {
  private logger = new Logger('GUARD');

  constructor(private jwtService: JwtService, private confiService: ConfigService) {
    //
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.confiService.get<string>('JWT_SECRET'),
        issuer: this.confiService.get<string>('JWT_ISSUER'),
        audience: this.confiService.get<string>('JWT_AUDIENCE'),
      });
      request['user'] = {email:payload.sub};
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
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
