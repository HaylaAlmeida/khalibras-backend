import {HttpErrors} from '@loopback/rest';
//import * as isEmail from 'isemail';
import {Credentials} from '../repositories/index';

export function validateCredentials(credentials: Credentials) {
  if (credentials?.email && credentials.email.trim().length < 3) {
    throw new HttpErrors.UnprocessableEntity('login deve ter pelo menos 3 caracteres');
  }
  if (credentials?.password && credentials.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity('senha deve ter pelo menos 8 caracteres')
  }
}
