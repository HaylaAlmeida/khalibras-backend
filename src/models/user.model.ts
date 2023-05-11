import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
    hidden: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
    index: {"unique": true},
  })
  email: string;

  @property({
    type: 'string'
  })
  role: string;

  @property({
    type: 'date',
    defaultFn: 'now'
  })
  createdAt?: string;

  @property({
    type: 'date',
  })
  updatedAt?: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
