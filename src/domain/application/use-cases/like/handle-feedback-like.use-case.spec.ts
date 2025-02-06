import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { LikeEntity } from '@root/domain/enterprise/entities/like.entity';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';
import { makeFakeAddress } from 'test/factory/make-fake-address';
import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
import { makeFakeBrand } from 'test/factory/make-fake-brand';
import { makeFakeFeedback } from 'test/factory/make-fake-feedback';
import { makeFakeLike } from 'test/factory/make-fake-like';
import { makeFakeUser } from 'test/factory/make-fake-user';
import { InMemoryAddressRepository } from 'test/repositories/in-memory-address-repository';
import { InMemoryAdvertisementRepository } from 'test/repositories/in-memory-advertisement-repository';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';
import { InMemoryFeedbackRepository } from 'test/repositories/in-memory-feedback-repository';
import { InMemoryImageRepository } from 'test/repositories/in-memory-image-repository';
import { InMemoryLikeAdvertisementRepository } from 'test/repositories/in-memory-like-advertisement-repository';
import { InMemoryLikeFeedbackRepository } from 'test/repositories/in-memory-like-feedback-repository';
import { InMemoryUserRepository } from 'test/repositories/in-memory-user-repository';

import { HandleFeedbackLikeUseCase } from './handle-feedback-like.use-case';

describe('Handle Feedback Like - Use Case', () => {
  let sut: HandleFeedbackLikeUseCase;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryFeedbackRepository: InMemoryFeedbackRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryLikeFeedbackRepository: InMemoryLikeFeedbackRepository;
  let inMemoryLikeAdvertisementRepository: InMemoryLikeAdvertisementRepository;
  let inMemoryAddressRepository: InMemoryAddressRepository;
  let inMemoryImageRepository: InMemoryImageRepository;

  beforeEach(() => {
    inMemoryImageRepository = new InMemoryImageRepository();
    inMemoryAddressRepository = new InMemoryAddressRepository();
    inMemoryBrandRepository = new InMemoryBrandRepository();
    inMemoryLikeAdvertisementRepository = new InMemoryLikeAdvertisementRepository();
    inMemoryAdvertisementRepository = new InMemoryAdvertisementRepository(
      inMemoryBrandRepository,
      inMemoryLikeAdvertisementRepository,
      inMemoryUserRepository,
      inMemoryImageRepository,
      inMemoryAddressRepository,
    );
    inMemoryUserRepository = new InMemoryUserRepository(inMemoryAdvertisementRepository);
    inMemoryLikeFeedbackRepository = new InMemoryLikeFeedbackRepository();
    inMemoryFeedbackRepository = new InMemoryFeedbackRepository(inMemoryUserRepository, inMemoryLikeFeedbackRepository);
    sut = new HandleFeedbackLikeUseCase(
      inMemoryLikeFeedbackRepository,
      inMemoryUserRepository,
      inMemoryFeedbackRepository,
    );
  });

  it('should be able create a new like to a advertisement if already exists', async () => {
    const user = makeFakeUser({ roles: [UserRoles.Manager, UserRoles.Seller] });
    inMemoryUserRepository.register({ user });

    const address = makeFakeAddress({ userId: user.id });
    inMemoryAddressRepository.create({ address });

    const brand = makeFakeBrand();
    inMemoryBrandRepository.create({ brand });

    const advertisement = makeFakeAdvertisement({ userId: user.id, brandId: brand.id });
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const feedback = makeFakeFeedback({
      userId: user.id,
      comment: 'Test Comment',
      stars: 1,
      advertisementId: advertisement.id,
    });
    inMemoryFeedbackRepository.create({ feedback });

    const output = await sut.execute({
      feedbackId: feedback.id,
      userId: user.id,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBeInstanceOf(LikeEntity);
    expect(inMemoryLikeFeedbackRepository.feedbackLikes).toHaveLength(1);
    expect(inMemoryLikeFeedbackRepository.feedbackLikes[0]).toEqual(
      expect.objectContaining({
        feedbackId: feedback.id,
        userId: user.id,
      }),
    );
  });

  it('should not be able create a new like to a advertisement if feedbackId is invalid (non-existent)', async () => {
    const user = makeFakeUser({ roles: [UserRoles.Manager, UserRoles.Seller] });
    inMemoryUserRepository.register({ user });

    const address = makeFakeAddress({ userId: user.id });
    inMemoryAddressRepository.create({ address });

    const brand = makeFakeBrand();
    inMemoryBrandRepository.create({ brand });

    const advertisement = makeFakeAdvertisement({ userId: user.id, brandId: brand.id });
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const output = await sut.execute({
      feedbackId: new UniqueEntityId(),
      userId: user.id,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
    expect(inMemoryLikeFeedbackRepository.feedbackLikes).toHaveLength(0);
  });

  it('should be able to remove the like if user already liked feedback', async () => {
    const user = makeFakeUser({ roles: [UserRoles.Manager, UserRoles.Seller] });
    inMemoryUserRepository.register({ user });

    const address = makeFakeAddress({ userId: user.id });
    inMemoryAddressRepository.create({ address });

    const brand = makeFakeBrand();
    inMemoryBrandRepository.create({ brand });

    const advertisement = makeFakeAdvertisement({ userId: user.id, brandId: brand.id });
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const feedback = makeFakeFeedback({ userId: user.id });
    inMemoryFeedbackRepository.create({ feedback });

    const like = makeFakeLike({ advertisementId: advertisement.id, userId: user.id, feedbackId: feedback.id });
    inMemoryLikeFeedbackRepository.create({ like });

    const output = await sut.execute({
      feedbackId: feedback.id,
      userId: user.id,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toEqual(null);
    expect(inMemoryLikeFeedbackRepository.feedbackLikes).toHaveLength(0);
  });
});
