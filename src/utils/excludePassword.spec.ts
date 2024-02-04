import { exclude, excludePassword } from './excludePassword';

describe('excludePassword', () => {
  it('should exclude password from object', () => {
    const user = {
      id: 1,
      username: 'test',
      password: 'password',
    };

    const result = exclude(user, ['password']);
    expect(result).toEqual({ id: 1, username: 'test' });
  });

  it('should exclude multiple keys from object', () => {
    const user = {
      id: 1,
      username: 'test',
      password: 'password',
    };

    const result = excludePassword(user);
    expect(result).toEqual({ id: 1, username: 'test' });
  });
});
