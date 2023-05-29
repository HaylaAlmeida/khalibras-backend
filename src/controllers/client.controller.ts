import {
  Count,
  CountSchema,
  Filter,
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
import {MY_JWT_CLIENT, PermissionKeys} from '../interceptor/permission-keys';
import {BcryptHasher} from '../services/hash.password';
import {PasswordHasherBindings} from '../keys';
import {inject} from '@loopback/core';
import {authenticate} from '@loopback/authentication';

export class ClientController {
  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository,

    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
  ) {}

  @authenticate(MY_JWT_CLIENT)
  @post('/clients')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['id', 'accessCode'],
          }),
        },
      },
    })
      user: Omit<User, 'id'>,
  ): Promise<User> {
    const exiUser = await this.userRepository.findOne({where: {email: user.email}, fields: {email: true}})
    if (exiUser) return Promise.reject(new HttpErrors.Forbidden('Usuário com o mesmo email cadastrado!'))

    user.role = PermissionKeys.CLIENT
    user.password = await this.hasher.hashPassword(user.password)
    return this.userRepository.create(user);
  }

  @authenticate(MY_JWT_CLIENT)
  @get('/clients/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count({role: PermissionKeys.CLIENT, ...where});
  }

  @authenticate(MY_JWT_CLIENT)
  @get('/clients')
  @response(200, {
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
    return this.userRepository.find({where: {role: PermissionKeys.CLIENT, ...filter?.where}, ...filter});
  }

  @authenticate(MY_JWT_CLIENT)
  @patch('/clients')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
      user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    if (user.password)
      user.password = await this.hasher.hashPassword(user.password)
    return this.userRepository.updateAll(user, where);
  }

  @authenticate(MY_JWT_CLIENT)
  @get('/clients/{id}')
  @response(200, {
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

    return this.userRepository.findById(id, filter);
  }

  @authenticate(MY_JWT_CLIENT)
  @patch('/clients/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
      user: User,
  ): Promise<void> {
    if (user.password)
      user.password = await this.hasher.hashPassword(user.password)
    await this.userRepository.updateById(id, user);
  }

  @authenticate(MY_JWT_CLIENT)
  @put('/clients/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    if (user.password)
      user.password = await this.hasher.hashPassword(user.password)

    await this.userRepository.replaceById(id, user);
  }

  @authenticate(MY_JWT_CLIENT)
  @del('/clients/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
