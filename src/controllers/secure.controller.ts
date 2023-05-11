import {authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, getJsonSchemaRef, getModelSchemaRef, HttpErrors, post, requestBody} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {PermissionKeys} from '../interceptor/permission-keys';
import {PasswordHasherBindings, TokenServiceBindings, UserServiceBindings} from '../keys';
import {User} from '../models';
import {Credentials, UserRepository} from '../repositories';
import {BcryptHasher} from '../services/hash.password';
import {JWTService} from '../services/jwt-service';
import {MyUserService} from '../services/user-service';
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';


export class SecureController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,

    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,

    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,

    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,

  ) { }
  @post('/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            properties: {
              email: {
                type: 'string',
                format: 'email'
              },
              password: {
                type: 'string'
              }
            },
            required: ['email', 'password']
          },

        },

      }
    }) credentials: Credentials,
  ): Promise<{token: string}> {
    const user = await this.userService.verifyCredentials(credentials);
    const userProfile = await this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);
    return Promise.resolve({token: token})
  }


  @authenticate("jwt")
  @get('/profile', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'The current user profile',
        content: {
          'application/json': {
            schema: getJsonSchemaRef(User),
          },
        },
      },
    },
  })
  async profile(
    @inject(AuthenticationBindings.CURRENT_USER)
      _user: UserProfile,
  ): Promise<unknown> {

    const user = (await this.userRepository.findById(_user[securityId], {fields: {password: false}}));
    if (!user) return Promise.reject(new HttpErrors[404]);
    let permission = user.role;
    if (user.role === PermissionKeys.EMPLOYEE) permission = 'Funcionário'
    if (user.role === PermissionKeys.CLIENT) permission = 'Cliente'
    return Promise.resolve({
      ...user,
      permission
    });
  }
}


