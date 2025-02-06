import { UserEntity } from '@root/domain/enterprise/entities/user.entity';

import { makeFakeUser } from './make-fake-user';

describe('Make Fake User - Function', () => {
  it('should be able to create an fake manager automatically', () => {
    const user = makeFakeUser();

    expect(user).toBeInstanceOf(UserEntity);
  });
});
