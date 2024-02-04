import { exclude } from './excludePassword';

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
});
