import { EPermission } from '@/enums/permission.enum';
import { ERole } from '@/enums/role.enum';

import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresUnAuth?: boolean;
    isPublic?: boolean;

    requiresRole?: ERole[];

    requiresPermission?: Array<EPermission | string>;
  }
}

export {};
