import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {KhalibrasDataSource} from '../datasources';
import {Chat, ChatRelations, Message} from '../models';
import {MessageRepository} from './message.repository';

export class ChatRepository extends DefaultCrudRepository<
  Chat,
  typeof Chat.prototype.id,
  ChatRelations
> {

  public readonly messages: HasManyRepositoryFactory<Message, typeof Message.prototype.id>;
  constructor(
    @inject('datasources.khalibras') dataSource: KhalibrasDataSource,
    @repository.getter('MessagesRepository') protected messagesRepositoryGetter: Getter<MessageRepository>,
  ) {
    super(Chat, dataSource);
    this.messages = this.createHasManyRepositoryFactoryFor('messages', messagesRepositoryGetter,);
    this.registerInclusionResolver('messages', this.messages.inclusionResolver);
  }
}
