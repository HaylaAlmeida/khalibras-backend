import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Chat} from './chat.model';
import {User} from './user.model';

@model({settings: {strict: false}})
export class Message extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  content?: string;

  @property({
    type: 'date',
    defaultFn: 'now'
  })
  createdAt?: string;

  @belongsTo(() => User)
  from: string;

  @belongsTo(() => User)
  to: string;

  @belongsTo(() => Chat)
  chatId: string;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Message>) {
    super(data);
  }
}

export interface MessageRelations {
  // describe navigational properties here
}

export type MessageWithRelations = Message & MessageRelations;
