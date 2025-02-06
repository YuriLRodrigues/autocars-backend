import { UserEntity } from '@root/domain/enterprise/entities/user.entity';

export class UserViewModel {
  static toHttp(user: UserEntity) {
    return {
      id: user.id.toValue(),
      avatar: user.avatar,
      name: user.name,
      username: user.username,
      email: user.email,
      roles: user.roles,
      disabled: user.disabled,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
