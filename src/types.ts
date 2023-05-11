import {PermissionKeys} from './interceptor/permission-keys';

export interface RequiredPermissions {
  required: PermissionKeys[];
}

export interface MyUserProfile {
  id: string;
  email?: string;
  name: string;
  permission: PermissionKeys;
}

