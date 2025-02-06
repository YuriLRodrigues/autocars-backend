import { makeFakeAdvertisement } from 'test/factory/make-fake-advertisement';
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

import { FindFeedbackIsLikedUseCase } from './find-feedback-is-liked.use-case';

describe('Find Feedback Is Liked - Use Case', () => {
  let sut: FindFeedbackIsLikedUseCase;
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
    sut = new FindFeedbackIsLikedUseCase(
      inMemoryLikeFeedbackRepository,
      inMemoryUserRepository,
      inMemoryFeedbackRepository,
    );
  });

  it('should validate that the user has already liked the feedback and value should return true', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const feedback = makeFakeFeedback({ advertisementId: advertisement.id, userId: user.id });
    inMemoryFeedbackRepository.create({ feedback });

    const like = makeFakeLike({ feedbackId: feedback.id, userId: user.id });
    inMemoryLikeFeedbackRepository.create({ like });

    const output = await sut.execute({
      feedbackId: feedback.id,
      userId: user.id,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBe(true);
    expect(inMemoryLikeFeedbackRepository.feedbackLikes).toHaveLength(1);
    expect(inMemoryLikeFeedbackRepository.feedbackLikes[0]).toEqual(
      expect.objectContaining({
        feedbackId: feedback.id,
        userId: user.id,
      }),
    );
  });

  it('should validate that the user has not liked the ad and value should return false', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository.createAd({ advertisement });

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const feedback = makeFakeFeedback({ advertisementId: advertisement.id, userId: user.id });
    inMemoryFeedbackRepository.create({ feedback });

    const output = await sut.execute({
      feedbackId: feedback.id,
      userId: user.id,
    });

    expect(inMemoryLikeFeedbackRepository.feedbackLikes).toHaveLength(0);
    expect(output.isRight()).toBe(true);
    expect(output.value).toBe(false);
  });
});
