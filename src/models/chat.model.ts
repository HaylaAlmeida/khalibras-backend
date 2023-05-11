import {Entity, hasMany, model, property} from '@loopback/repository';
import {Message} from './message.model';
import {User} from './user.model';

@model({settings: {strict: false}})
export class Chat extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @hasMany(() => User, {name: 'users'})
  users?: User[];

  @hasMany(() => Message, {name: 'messages'})
  messages?: Message[];

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Chat>) {
    super(data);
  }
}

export interface ChatRelations {
  // describe navigational properties here
}

export type ChatWithRelations = Chat & ChatRelations;
