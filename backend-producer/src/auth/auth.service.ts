import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly configService : ConfigService,
        private jwtService: JwtService
    ){
      //
    }
  
  async createPassword(password: string) {
      const salt = await bcrypt.genSaltSync(10);
      return bcrypt.hashSync(password, salt);
  }

  createToken(email: string) {
    const payload = { sub: email.toLowerCase() };
    let expiresIn = Math.floor(new Date().getTime() / 1000.0) + 24 * 3600; // 24 hours
    let issuer = this.configService.get<string>('JWT_ISSUER');
    let secret = this.configService.get<string>('JWT_SECRET');
    let audience = this.configService.get<string>('JWT_AUDIENCE');
    return this.jwtService.sign(payload, { secret, expiresIn, issuer, audience });
  }

  isHashSame(original: string, hashed: string): boolean {
    try {
      if (hashed.length > 0) {
        return bcrypt.compareSync(original, hashed);
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  verifyLoginCredential(email:string, password:string){
    const savedEmail = this.configService.get<string>('CRED_EMAIL')
    const savedHashed = this.configService.get<string>('CRED_HASHED')
    return email === savedEmail && this.isHashSame(password, savedHashed)
  }

}
