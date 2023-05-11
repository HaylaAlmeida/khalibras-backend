import {AuthenticationMetadata} from '@loopback/authentication';

export const enum PermissionKeys {
  // normal authenticated user
  ADMIN = 'Admin',
  EMPLOYEE = 'Funcionário',
  CLIENT = 'Cliente'
}


export const MY_JWT_ADMIN: AuthenticationMetadata = {
  strategy: "jwt", options: {
    required: [PermissionKeys.ADMIN]
  }
};

export const MY_JWT_EMPLOYEE: AuthenticationMetadata = {
  strategy: "jwt", options: {
    required: [PermissionKeys.EMPLOYEE]
  }
};

export const MY_JWT_CLIENT: AuthenticationMetadata = {
  strategy: "jwt", options: {
    required: [PermissionKeys.CLIENT]
  }
};


export const MY_JWT_ADMIN_EMPLOYEE: AuthenticationMetadata = {
  strategy: "jwt",
  options: {
    required: [PermissionKeys.ADMIN, PermissionKeys.EMPLOYEE]
  }
}

export const MY_JWT_ALL: AuthenticationMetadata = {
  strategy: "jwt"
};

