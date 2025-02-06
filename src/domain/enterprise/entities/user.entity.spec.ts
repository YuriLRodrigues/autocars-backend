import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';

import { UserEntity, UserRoles } from './user.entity';

describe('User - Entity', () => {
  it('should be able to create a user as an entity', () => {
    const output = UserEntity.create({
      avatar: 'Avatar 1',
      username: 'john',
      email: 'email@example.com',
      name: 'John',
      password: 'password',
      roles: [UserRoles.Seller],
    });

    expect(output.id).toBeInstanceOf(UniqueEntityId);
    expect(output.avatar).toBe('Avatar 1');
    expect(output.username).toBe('john');
    expect(output.name).toBe('John');
    expect(output.email).toBe('email@example.com');
    expect(output.password).toBe('password');
    expect(output.roles).toEqual(expect.arrayContaining([UserRoles.Seller]));
    expect(output.updatedAt).toBeInstanceOf(Date);
    expect(output.createdAt).toBeInstanceOf(Date);
  });
});
