import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@profilehub/types';

export const ROLES_KEY = 'roles';

/**
 * Decorator to restrict route access to specific roles.
 * Usage: @Roles(UserRole.ADMIN, UserRole.MODERATOR)
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
