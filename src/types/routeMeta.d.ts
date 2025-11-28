import { EPermission } from '@/enums/permission.enum';
import { ERole } from '@/enums/role.enum';

import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresUnAuth?: boolean;
    isPublic?: boolean;
    // isGuest?: boolean

    /**
     * Roles required to access this route
     * User must have at least ONE of these roles
     * @example requiresRole: [ERole.ADMIN, ERole.SUPERVISOR]
     */
    requiresRole?: ERole[];

    /**
     * Permissions required to access this route
     * User must have ALL of these permissions
     * @example requiresPermission: [EPermission.WORKTIME_USAGE_VIEW]
     */
    requiresPermission?: Array<EPermission | string>;
  }
}

export {};
