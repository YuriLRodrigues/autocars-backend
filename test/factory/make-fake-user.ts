import { faker } from '@faker-js/faker';
import { UserEntity, UserEntityProps, UserRoles } from '@root/domain/enterprise/entities/user.entity';

type Overwrides = Partial<UserEntityProps>;

export const makeFakeUser = (data = {} as Overwrides) => {
  const avatar = faker.image.avatar();
  const email = faker.internet.email();
  const name = faker.person.fullName();
  const username = faker.internet.userName();
  const password = faker.internet.password();
  const roles = [UserRoles.Customer];
  let disabled: undefined;
  const createdAt = faker.date.past();
  const updatedAt = faker.date.recent();

  return UserEntity.create({
    avatar: data.avatar ?? avatar,
    email: data.email ?? email,
    name: data.name ?? name,
    username: data.username ?? username,
    password: data.password ?? password,
    roles: data.roles ?? roles,
    disabled: data.disabled ?? disabled,
    createdAt: data.createdAt ?? createdAt,
    updatedAt: data.updatedAt ?? updatedAt,
  });
};
