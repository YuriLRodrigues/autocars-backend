import { CanActivate, ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserPayload } from './auth-user';
import { IS_PUBLIC_KEY } from './public';
import { ROLES, RolesType } from './roles';
import 'reflect-metadata';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const permissions = this.reflector.getAllAndOverride<RolesType>(ROLES, [context.getHandler(), context.getClass()]);

    if (!permissions || permissions?.roles?.length === 0) {
      return true;
    }

    const { roles: userRoles }: UserPayload = context.switchToHttp().getRequest()?.user;

    const { roles: RolesRequeired, isAll } = permissions;

    let hasPermission = false;

    if (isAll) {
      hasPermission = RolesRequeired.every((role) => userRoles.includes(role));
    } else {
      hasPermission = RolesRequeired.some((role) => userRoles.includes(role));
    }

    if (!hasPermission) {
      throw new HttpException('Unauthorized Roles', 401, {
        cause: {
          name: 'Unauthorized Roles',
          message: 'You must provide a valid authorization header',
        },
        description: 'You must provide a valid authorization header',
      });
    }

    return true;
  }
}
