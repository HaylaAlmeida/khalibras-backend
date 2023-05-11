import {
  Count,
  CountSchema,
  Filter, FilterBuilder,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response, HttpErrors,
} from '@loopback/rest';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {MY_JWT_ADMIN, PermissionKeys} from '../interceptor/permission-keys';
import {BcryptHasher} from '../services/hash.password';
import {PasswordHasherBindings} from '../keys';
import {inject} from '@loopback/core';
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';
import {authenticate} from '@loopback/authentication';

export class AdminController {

  private roles: string[] = [PermissionKeys.ADMIN, PermissionKeys.EMPLOYEE, PermissionKeys.CLIENT];
  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository,

    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
  ) {}

  @authenticate(MY_JWT_ADMIN)
  @post('/admin/users')
  @response(200, {
    security: OPERATION_SECURITY_SPEC,
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser'
          }),
        },
      },
    })
      user: Omit<User, 'id'>,
  ): Promise<User | typeof HttpErrors.Forbidden> {
    user.password = await this.hasher.hashPassword(user.password)
    user.email = user.email.trim();
    const exiUser = await this.userRepository.findOne({where: {email: user.email}, fields: {email: true}})
    if (exiUser) return new Promise((res, rej) => rej(new HttpErrors.Forbidden('Usuário com o mesmo email cadastrado!')))
    if (!(user.role) || !this.roles.includes(user.role)) {
      return Promise.reject(new HttpErrors.UnprocessableEntity('Papel de usuário precisa ser: ' + this.roles.join(', ') + '.'))
    }
    return this.userRepository.create(user);
  }

  @authenticate(MY_JWT_ADMIN)
  @get('/admin/users/count')
  @response(200, {
    security: OPERATION_SECURITY_SPEC,
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @authenticate(MY_JWT_ADMIN)
  @get('/admin/users')
  @response(200, {
    security: OPERATION_SECURITY_SPEC,
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    let filterWithoutPassword = new FilterBuilder<User>();
    if (filter) {
      filterWithoutPassword = new FilterBuilder(filter);
    }
    filterWithoutPassword.fields({password: false})
    return this.userRepository.find(filterWithoutPassword.build());
  }

  @authenticate(MY_JWT_ADMIN)
  @get('/admin/users/{id}')
  @response(200, {
    security: OPERATION_SECURITY_SPEC,
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    const user = await this.userRepository.findById(id, filter);
    user.password = "";
    return user;
  }

  @authenticate(MY_JWT_ADMIN)
  @put('/admin/users/{id}')
  @response(204, {
    security: OPERATION_SECURITY_SPEC,
    description: 'User user data',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    const userDb = await this.userRepository.findById(id);
    userDb.name = user.name
    userDb.role = user.role
    userDb.email = user.email.trim()
    userDb.phone = user.phone
    userDb.updatedAt = new Date().toISOString()
    await this.userRepository.update(userDb);
  }

  @authenticate(MY_JWT_ADMIN)
  @put('/admin/users/{id}/password')
  @response(204, {
    security: OPERATION_SECURITY_SPEC,
    description: 'Update user password',
  })
  async replacePasswordById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    const userDb = await this.userRepository.findById(id);
    userDb.password = await this.hasher.hashPassword(user.password)

    await this.userRepository.update(userDb);
  }

  @authenticate(MY_JWT_ADMIN)
  @del('/admin/users/{id}')
  @response(204, {
    security: OPERATION_SECURITY_SPEC,
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
