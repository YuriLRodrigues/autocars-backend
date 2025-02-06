import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
import { makeFakeFeedback } from 'test/factory/make-fake-feedback';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryFeedbackRepository } from 'test/repositories/in-memory-feedback-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryLikeFeedbackRepository } from 'test/repositories/in-memory-like-feedback-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { FindAllByAdvertisementIdUseCase } from './find-all-by-advertisement-id.use-case';

describe('Find All By Advertisement Id - Use Case', () => {
  let sut: FindAllByAdvertisementIdUseCase;
  let inMemoryFeedbackRepository: InMemoryFeedbackRepository;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryLikeFeedbackRepository: InMemoryLikeFeedbackRepository;
  let inMemoryLikeAdvertisementRepository: InMemoryLikeAdvertisementRepository;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryImageRepository: InMemoryImageRepository;
  let inMemoryAddressRepository: InMemoryAddressRepository;

  beforeEach(() => {
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryImageRepository = new InMemoryImageRepository();
    inMemoryAddressRepository = new InMemoryAddressRepository();
    inMemoryUserRepository = new InMemoryUserRepository(inMemoryAdvertisementRepository);
    inMemoryLikeFeedbackRepository = new InMemoryLikeFeedbackRepository();
    inMemoryLikeAdvertisementRepository = new InMemoryLikeAdvertisementRepository();
    inMemoryFeedbackRepository = new InMemoryFeedbackRepository(inMemoryUserRepository, inMemoryLikeFeedbackRepository);
    inMemoryAdvertisementRepository = new InMemoryAdvertisementRepository(
      inMemoryBrandRepository,
      inMemoryLikeAdvertisementRepository,
      inMemoryUserRepository,
      inMemoryImageRepository,
      inMemoryAddressRepository,
    );
    sut = new FindAllByAdvertisementIdUseCase(inMemoryFeedbackRepository);
  });

  it('should be able to find all feedbacks by advertisement id', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository;

    Array.from({ length: 5 }).map(() => {
      const user = makeFakeUser();
      inMemoryUserRepository.register({ user });

      const feedback = makeFakeFeedback({ advertisementId: advertisement.id, userId: user.id });
      inMemoryFeedbackRepository.create({ feedback });
    });

    const output = await sut.execute({
      advertisementId: advertisement.id,
      limit: 10,
      page: 1,
    });

    expect(output.isRight()).toBe(true);
    expect(inMemoryFeedbackRepository.feedbacks).toHaveLength(5);
    expect(output.value).toEqual(
      expect.objectContaining({
        meta: expect.objectContaining({
          page: 1,
          perPage: 10,
          totalPages: 1,
          totalCount: 5,
        }),
        data: expect.any(Array),
      }),
    );
  });

  it('should be able to return an array with size 0 if there is no feedback', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository;

    const output = await sut.execute({
      advertisementId: advertisement.id,
      limit: 10,
      page: 1,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toEqual(
      expect.objectContaining({
        meta: expect.objectContaining({
          page: 1,
          perPage: 10,
          totalPages: 0,
          totalCount: 0,
        }),
        data: [],
      }),
    );
  });
});
