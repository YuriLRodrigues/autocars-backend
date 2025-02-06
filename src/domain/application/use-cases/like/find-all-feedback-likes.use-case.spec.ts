import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
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

import { FindAllFeedbackLikesUseCase } from './find-all-feedback-likes.use-case';

describe('Find All Feedback Likes - Use Case', () => {
  let sut: FindAllFeedbackLikesUseCase;
  let inMemoryBrandRepository: InMemoryBrandRepository;
  let inMemoryAdvertisementRepository: InMemoryAdvertisementRepository;
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryLikeFeedbackRepository: InMemoryLikeFeedbackRepository;
  let inMemoryLikeAdvertisementRepository: InMemoryLikeAdvertisementRepository;
  let inMemoryFeedbackRepository: InMemoryFeedbackRepository;
  let inMemoryAddressRepository: InMemoryAddressRepository;
  let inMemoryImageRepository: InMemoryImageRepository;

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
    inMemoryLikeFeedbackRepository = new InMemoryLikeFeedbackRepository();
    inMemoryFeedbackRepository = new InMemoryFeedbackRepository(inMemoryUserRepository, inMemoryLikeFeedbackRepository);
    sut = new FindAllFeedbackLikesUseCase(inMemoryLikeFeedbackRepository, inMemoryFeedbackRepository);
  });

  it('should be able to find all likes of a feedback by your id', async () => {
    const user = makeFakeUser({ roles: [UserRoles.Manager, UserRoles.Seller] });
    inMemoryUserRepository.register({ user });

    const address = makeFakeAddress({ userId: user.id });
    inMemoryAddressRepository.create({ address });

    const brand = makeFakeBrand();
    inMemoryBrandRepository.create({ brand });

    const advertisement = makeFakeAdvertisement({ userId: user.id, brandId: brand.id });
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const feedback = makeFakeFeedback({ advertisementId: advertisement.id, userId: user.id });
    inMemoryFeedbackRepository.create({ feedback });

    Array.from({ length: 5 }).map(() => {
      const like = makeFakeLike({ feedbackId: feedback.id, userId: user.id });
      inMemoryLikeFeedbackRepository.create({ like });
    });

    Array.from({ length: 5 }).map(() => {
      const like = makeFakeLike();
      inMemoryLikeFeedbackRepository.create({ like });
    });

    const output = await sut.execute({
      feedbackId: feedback.id,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBe(5);
    expect(inMemoryLikeFeedbackRepository.feedbackLikes).toHaveLength(10);
  });

  it('should not be able to find all likes of a feedback if your id is invalid (non-existent)', async () => {
    const output = await sut.execute({
      feedbackId: new UniqueEntityId(),
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
  });
});
