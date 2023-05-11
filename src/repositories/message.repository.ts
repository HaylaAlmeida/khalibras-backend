import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, repository} from '@loopback/repository';
import {KhalibrasDataSource} from '../datasources';
import {Chat, Message, MessageRelations} from '../models';
import {ChatRepository} from './chat.repository';

export class MessageRepository extends DefaultCrudRepository<
  Message,
  typeof Message.prototype.id,
  MessageRelations
> {
  public readonly chat: BelongsToAccessor<Chat, typeof Chat.prototype.id>;
  constructor(
    @inject('datasources.khalibras') dataSource: KhalibrasDataSource,
    @repository.getter('ChatRepository') protected chatRepositoryGetter: Getter<ChatRepository>,
  ) {
    super(Message, dataSource);
    this.chat = this.createBelongsToAccessorFor('chat', chatRepositoryGetter,);
    this.registerInclusionResolver('chat', this.chat.inclusionResolver);
  }
}
