import { Prisma, User, UserRole } from '@prisma/client';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { UserEntity, UserRoles } from '@root/domain/enterprise/entities/user.entity';

export class UserMappers {
  static toDomain(user: User): UserEntity {
    return UserEntity.create(
      {
        avatar: user.avatar,
        email: user.email,
        name: user.name,
        disabled: user.disabled,
        password: user.password,
        username: user.username,
        createdAt: user.createdAt,
        roles: user.roles.map((role) => UserRoles[role]) ?? [UserRoles.Customer],
        updatedAt: user.updatedAt,
      },
      new UniqueEntityId(user.id),
    );
  }

  static toPersistence(user: UserEntity): Prisma.UserCreateInput {
    return {
      avatar: user.avatar,
      email: user.email,
      name: user.name,
      password: user.password,
      username: user.username,
      disabled: user.disabled,
      createdAt: new Date(user.createdAt),
      id: user.id.toValue(),
      roles: user.roles.map((role) => UserRole[role]) ?? [UserRole.Customer],
      updatedAt: new Date(user.updatedAt),
    };
  }
}
