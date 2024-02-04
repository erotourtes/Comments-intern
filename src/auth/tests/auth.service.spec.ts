import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersModule } from '../../users/users.module';
import { hashPassword } from '../../utils/hash';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
      imports: [UsersModule],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should validate password', async () => {
    const result = await hashPassword('password');
    expect(result).not.toEqual('password');

    expect(
      // @ts-ignore
      await service['validatePasswordFor'](result, 'password'),
    ).toBe(true);
  });
});
