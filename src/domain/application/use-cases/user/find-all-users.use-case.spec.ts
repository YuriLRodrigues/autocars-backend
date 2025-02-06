import { UserEntity, UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { FindAllUsersUseCase } from './find-all-users.use-case';

describe('Find All Users - Use Case', () => {
  let sut: FindAllUsersUseCase;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryLikeAdvertisementRepository: InMemoryLikeAdvertisementRepository;
  let inMemoryImageRepository: InMemoryImageRepository;
  let inMemoryAddressRepository: InMemoryAddressRepository;

  beforeEach(() => {
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryImageRepository = new InMemoryImageRepository();
    inMemoryAddressRepository = new InMemoryAddressRepository();
    inMemoryUserRepository = new InMemoryUserRepository(inMemoryAdvertisementRepository);
    inMemoryLikeAdvertisementRepository = new InMemoryLikeAdvertisementRepository();
    inMemoryAdvertisementRepository = new InMemoryAdvertisementRepository(
      inMemoryBrandRepository,
      inMemoryLikeAdvertisementRepository,
      inMemoryUserRepository,
      inMemoryImageRepository,
      inMemoryAddressRepository,
    );
    sut = new FindAllUsersUseCase(inMemoryUserRepository);
    for (let i = 1; i <= 12; i++) {
      const user = UserEntity.create({
        avatar: 'Avatar 1',
        username: `user_${i}`,
        email: `emailtest${i}@example.com`,
        name: 'TestUser',
        password: 'password',
      });
      inMemoryUserRepository.register({ user });
    }
  });

  it('should return all users', async () => {
    const user = makeFakeUser({ roles: [UserRoles.Manager] });
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({ limit: 10, page: 1, id: user.id });

    expect(output.isRight()).toBe(true);
    expect(output.value).toEqual(
      expect.objectContaining({
        meta: expect.objectContaining({
          page: 1,
          perPage: 10,
          totalPages: 2,
          totalCount: 13,
        }),
        data: expect.any(Array),
      }),
    );
    expect(inMemoryUserRepository.users).toHaveLength(13);
  });
});
