import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt'

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, ConfigService, JwtService],
      imports: [
        ConfigModule.forRoot(),
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return a JWT token for valid credentials', async () => {
      jest
        .spyOn(authService, 'verifyLoginCredential')
        .mockImplementation(() => true );

      const loginData = {email:'niroj.magar.dev@gmail.com', password:'password1'};
      const response = await controller.login(loginData);
      expect(response).toBeDefined();
    });
  })

});
