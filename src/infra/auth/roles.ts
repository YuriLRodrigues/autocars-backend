import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '@root/domain/enterprise/entities/user.entity';

export type RolesType = {
  roles: UserRoles[];
  isAll?: boolean;
};

export const ROLES = 'ROLES';

export const Roles = ({ roles, isAll = true }: RolesType) => {
  return SetMetadata(ROLES, { roles, isAll });
};
