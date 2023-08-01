import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt'

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, ConfigService, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create & Verify Password', () => {
    let password
    it('should create hashed password', async () => {
      password = await service.createPassword('password')
      expect(password).toBeDefined();
    });
    it('should pass compare hashed password', async () => {
      expect(await service.isHashSame('password', password)).toBe(true);
    });
    it('should fail compare hashed password', async () => {
      expect(await service.isHashSame('@password', password)).toBe(false);
    });
  });
  
});
