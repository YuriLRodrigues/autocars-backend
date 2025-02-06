import { Me } from '@root/domain/enterprise/value-object/me';

export class MeViewModel {
  static toHttp(data: Me) {
    return {
      user: {
        id: data.user.id.toValue(),
        blurHash: data.user.blurHash,
        avatar: data.user.avatar,
        email: data.user.email,
        username: data.user.username,
        name: data.user.name,
        roles: data.user.roles,
      },
      address: {
        id: data.address.id.toValue(),
        street: data.address.street,
        city: data.address.city,
        state: data.address.state,
        zipCode: data.address.zipCode,
        country: data.address.country,
        neighborhood: data.address.neighborhood,
      },
    };
  }
}
