import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
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

import { UpdateFeedbackUseCase } from './update-feedback.use-case';

describe('Update Feedback - Use Case', () => {
  let sut: UpdateFeedbackUseCase;
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
    sut = new UpdateFeedbackUseCase(inMemoryFeedbackRepository, inMemoryUserRepository);
  });

  it('should be able to update a feedback if your are manager or owner', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository;

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const feedback = makeFakeFeedback({ advertisementId: advertisement.id, userId: user.id });
    inMemoryFeedbackRepository.create({ feedback });

    const output = await sut.execute({
      feedbackId: feedback.id,
      userId: user.id,
      comment: 'New Comment',
      stars: 3,
    });

    expect(output.isRight()).toBe(true);
    expect(output.value).toBe(null);
    expect(inMemoryFeedbackRepository.feedbacks[0]).toEqual(
      expect.objectContaining({
        comment: 'New Comment',
        stars: 3,
      }),
    );
    expect(inMemoryFeedbackRepository.feedbacks).toHaveLength(1);
  });

  it('should not be able to update a feedback if you are not owner or manager', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository;

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const feedback = makeFakeFeedback({ advertisementId: advertisement.id, comment: 'Initial Comment', stars: 1 });
    inMemoryFeedbackRepository.create({ feedback });

    const output = await sut.execute({
      feedbackId: feedback.id,
      userId: user.id,
      comment: 'New Comment',
      stars: 3,
    });

    expect(output.isLeft()).toBe(true);
    expect(inMemoryFeedbackRepository.feedbacks[0]).toEqual(
      expect.objectContaining({
        comment: 'Initial Comment',
        stars: 1,
      }),
    );
    expect(output.value).toBeInstanceOf(NotAllowedError);
  });

  it('should not be able to update a feedback if userId is invalid (non-existent)', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository;

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const feedback = makeFakeFeedback({ advertisementId: advertisement.id, comment: 'Initial Comment', stars: 1 });
    inMemoryFeedbackRepository.create({ feedback });

    const output = await sut.execute({
      feedbackId: feedback.id,
      userId: new UniqueEntityId(),
      comment: 'Initial Comment',
      stars: 1,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
    expect(inMemoryFeedbackRepository.feedbacks[0]).toEqual(
      expect.objectContaining({
        comment: 'Initial Comment',
        stars: 1,
      }),
    );
  });

  it('should not be able to update a feedback if feedbackId is invalid (non-existent)', async () => {
    const advertisement = makeFakeAdvertisement();
    inMemoryAdvertisementRepository;

    const user = makeFakeUser();
    inMemoryUserRepository.register({ user });

    const feedback = makeFakeFeedback({ advertisementId: advertisement.id, comment: 'Initial Comment', stars: 1 });
    inMemoryFeedbackRepository.create({ feedback });

    const output = await sut.execute({
      feedbackId: new UniqueEntityId(),
      userId: user.id,
      comment: 'Initial Comment',
      stars: 1,
    });

    expect(output.isLeft()).toBe(true);
    expect(output.value).toBeInstanceOf(ResourceNotFoundError);
    expect(inMemoryFeedbackRepository.feedbacks[0]).toEqual(
      expect.objectContaining({
        comment: 'Initial Comment',
        stars: 1,
      }),
    );
  });
});
