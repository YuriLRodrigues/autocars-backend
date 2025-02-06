import { Entity } from '@root/core/domain/entity/entity';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Optional } from '@root/core/logic/Optional';
import { validateUsername } from '@root/utils/validate-username';

export enum UserRoles {
  Manager = 'Manager',
  Seller = 'Seller',
  Customer = 'Customer',
}

export type UserEntityProps = {
  name: string;
  username: string;
  avatar?: string;
  email: string;
  password: string;
  roles: UserRoles[];
  disabled?: Date;
  createdAt: Date;
  updatedAt?: Date;
};

type EditUserProps = {
  name?: string;
  avatar?: string;
  username?: string;
  email?: string;
};

export class UserEntity extends Entity<UserEntityProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get username() {
    return this.props.username;
  }

  get avatar() {
    return this.props.avatar;
  }

  get roles() {
    return this.props.roles;
  }

  get disabled() {
    return this.props.disabled;
  }

  set roles(roles: UserRoles[]) {
    this.props.roles = this.props.roles.concat(roles);
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  public touch() {
    this.props.updatedAt = new Date();
  }

  set disabled(date: Date) {
    this.props.disabled = date;
  }

  set password(password: string) {
    this.props.password = password;
    this.touch();
  }

  static create(
    props: Optional<UserEntityProps, 'createdAt' | 'roles' | 'disabled' | 'updatedAt'>,
    id?: UniqueEntityId,
  ): UserEntity {
    const user = new UserEntity(
      {
        avatar: props.avatar ?? undefined,
        username: validateUsername(props.username),
        name: props.name,
        email: props.email,
        password: props.password,
        roles: props.roles ?? [UserRoles.Customer],
        disabled: props.disabled ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    );

    return user;
  }

  public editInfo(props: EditUserProps): UserEntity {
    this.props.avatar = props.avatar || this.props.avatar;
    this.props.name = props.name || this.props.name;
    this.props.username = props.username ? validateUsername(props.username) : this.props.username;
    this.props.updatedAt = new Date();

    return this;
  }
}
