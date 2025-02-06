import { repeat } from '@root/utils/repeat';
import { makeFakeBrand } from 'test/factory/make-fake-brand';
import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository';

import { FindAllBrandsUseCase } from './find-all-brands.use-case';

describe('Find All Brands - Use Case', () => {
  let sut: FindAllBrandsUseCase;
  let inMemoryBrandRepository: InMemoryBrandRepository;

  beforeEach(() => {
    inMemoryBrandRepository = new InMemoryBrandRepository();
    sut = new FindAllBrandsUseCase(inMemoryBrandRepository);
  });

  it('should be able return all brands', async () => {
    repeat(10, () => {
      const brand = makeFakeBrand();
      inMemoryBrandRepository.create({ brand });
    });

    const output = await sut.execute({
      limit: 10,
      page: 1,
    });

    expect(output.isRight()).toBe(true);

    if (output.isRight()) {
      expect(output.value.data).toHaveLength(10);
    }
  });

  it('should be able to return an lenght 0 if items not exist', async () => {
    const output = await sut.execute({
      limit: 10,
      page: 1,
    });

    expect(output.isRight()).toBe(true);

    if (output.isRight()) {
      expect(output.value.data).toHaveLength(0);
    }
  });
});
