import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryFeedbackRepository } from 'test/repositories/in-memory-feedback-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryLikeFeedbackRepository } from 'test/repositories/in-memory-like-feedback-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { CreateFeedbackUseCase } from './create-feedback.use-case';

describe('Create Feedback - Use Case', () => {
  let sut: CreateFeedbackUseCase;
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
    sut = new CreateFeedbackUseCase(
      inMemoryFeedbackRepository,
      inMemoryAdvertisementRepository,
      inMemoryUserRepository,
    );
  });

  it('should be able top create a new feedback in any ', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const output = await sut.execute({
      advertisementId: advertisement.id,
      comment: 'New Comment',
      stars: 5,
      userId: user.id,
      title: 'Title test',
    });

    expect(output.isRight()).toBe(true);
    expect(inMemoryFeedbackRepository.feedbacks).toHaveLength(1);
    expect(output.value).toEqual(
      expect.objectContaining({
        advertisementId: advertisement.id,
        comment: 'New Comment',
        stars: 5,
        userId: user.id,
        title: 'Title test',
      }),
    );
  });

  it('should not be able possible to create new feedback if an ad does not exist', async () => {
    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const output = await sut.execute({
      advertisementId: new UniqueEntityId(),
      comment: 'New Comment',
      stars: 5,
      userId: user.id,
      title: 'Title test',
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
    expect(inMemoryFeedbackRepository.feedbacks).toHaveLength(0);
  });
});
